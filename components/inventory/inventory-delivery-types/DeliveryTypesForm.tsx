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
    createDeliveryType,
    updateDeliveryType,
    DeliveryType,
} from "@/apiServices/inventoryDeliveryTypesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeliveryTypesFormProps {
    title: string;
    item?: DeliveryType;
}

interface FormValues {
    name: string;
    status: string;
}

export default function DeliveryTypesForm({
    title,
    item,
}: DeliveryTypesFormProps) {
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
            status: "1",
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                name: item.name || "",
                status: item.status?.toString() || "1",
            });
        }
    }, [item, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        try {
            const res = item
                ? await updateDeliveryType(Number(item.id), formData)
                : await createDeliveryType(formData);

            if (res?.success) {
                reset();
                toast.success(
                    res.message || "Delivery type saved successfully!",
                );
                router.push("/inventory/inventory-delivery-types");
            } else {
                if (res.errors) {
                    toast.error(
                        res.message || "Failed to save delivery type",
                    );
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
                    toast.error(
                        res.message || "Failed to save delivery type",
                    );
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

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Enter delivery type name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
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
                            <p className="text-sm text-red-500 mt-1">
                                {errors.status.message}
                            </p>
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
                            : item
                              ? "Update"
                              : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
