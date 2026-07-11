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
import { createDepartment, updateDepartment, Department } from "@/apiServices/departmentService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DepartmentsFormProps {
    title: string;
    item?: Department;
}

interface FormValues {
    name: string;
    display_order: string;
    status: string;
}

export default function DepartmentsForm({
    title,
    item,
}: DepartmentsFormProps) {
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
            name: "",
            display_order: "1",
            status: "1",
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                name: item.name || "",
                display_order: item.display_order?.toString() || "1",
                status: item.status?.toString() || "1",
            });
        }
    }, [item, reset]);

    const submitHandler = async (values: FormValues) => {
        const payload = {
            name: values.name,
            display_order: Number(values.display_order),
            status: Number(values.status),
        };

        try {
            const res = item
                ? await updateDepartment(Number(item.id), payload)
                : await createDepartment(payload);

            if (res?.success) {
                reset();
                toast.success(res.message || "Department saved successfully!");
                router.push("/lms/departments");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save department");
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
                    toast.error(res.message || "Failed to save department");
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
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Department Name<span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter department name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Display Order
                        </label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Enter display order"
                            {...register("display_order")}
                        />
                        {errors.display_order && (
                            <p className="text-sm text-red-500 mt-1">{errors.display_order.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
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
                        {isSubmitting ? "Submitting..." : item ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
