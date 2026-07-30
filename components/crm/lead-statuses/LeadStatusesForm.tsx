"use client";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { createCrmStatus, updateCrmStatus, CrmStatus } from "@/apiServices/crmStatusesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LeadStatusesFormProps {
    title: string;
    item?: CrmStatus;
}

interface FormValues {
    status: string;
    type: string;
}

export default function LeadStatusesForm({
    title,
    item,
}: LeadStatusesFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            status: "",
            type: "1",
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                status: item.status || "",
                type: item.type?.toString() || "1",
            });
        }
    }, [item, reset]);

    const submitHandler = async (values: FormValues) => {
        const payload = {
            status: values.status,
            type: Number(values.type),
        };

        try {
            const res = item
                ? await updateCrmStatus(Number(item?.id), payload)
                : await createCrmStatus(payload);

            if (res?.success) {
                reset();
                toast.success(res.message || "Lead status saved successfully!");
                router.push("/crm/lead-statuses");
            } else {
                if (res?.errors) {
                    toast.error(res?.message || "Failed to save lead status");
                    Object.entries(res?.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        setError(field as keyof FormValues, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res?.message || "Failed to save lead status");
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        }
    };

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.back()}
                    className="cursor-pointer"
                >
                    Go Back
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter status name" {...register("status")} />
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Type<span className="text-red-500">*</span></label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Lead</SelectItem>
                                        <SelectItem value="2">Activity</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : item ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
