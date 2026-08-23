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
import {
    createEarningSite,
    updateEarningSite,
    EarningSite,
} from "@/apiServices/earningSiteService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EarningSiteFormProps {
    title: string;
    earningSite?: EarningSite;
}

interface FormValues {
    title: string;
    status: string;
}

export default function EarningSiteForm({
    title,
    earningSite,
}: EarningSiteFormProps) {
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
            title: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (earningSite) {
            reset({
                title: earningSite.title || "",
                status: String(earningSite.status ?? "1"),
            });
        }
    }, [earningSite, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const res = earningSite
                ? await updateEarningSite(Number(earningSite.id), formData)
                : await createEarningSite(formData);

            if (res.success) {
                reset();
                toast.success(res.message || "Earning site saved successfully!");
                router.push("/lms/earning-sites");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save earning site");
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        setError(field as keyof FormValues, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res.message || "Failed to save earning site");
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title<span className="text-red-500"> *</span>
                        </label>
                        <Input
                            placeholder="Enter earning site title"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-lg cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white px-8 rounded-lg cursor-pointer"
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : earningSite
                            ? "Update"
                            : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
