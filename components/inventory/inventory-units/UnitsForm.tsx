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
import { createUnit, updateUnit, Unit } from "@/apiServices/inventoryUnitsService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UnitsFormProps {
    title: string;
    unit?: Unit;
}

interface FormValues {
    name: string;
    full_name: string;
    status: string;
}

export default function UnitsForm({
    title,
    unit,
}: UnitsFormProps) {
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
            full_name: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (unit) {
            reset({
                name: unit.name || "",
                full_name: unit.full_name || "",
                status: unit.status?.toString() || "1",
            });
        }
    }, [unit, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const res = unit
                ? await updateUnit(Number(unit.id), formData)
                : await createUnit(formData);

            if (res.success) {
                reset();
                toast.success(res.message || "Unit saved successfully!");
                router.push("/inventory/inventory-units");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save unit");
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
                    toast.error(res.message || "Failed to save unit");
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
                    {/* Short Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Short Name (e.g., pcs, kg)<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter short name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name (e.g., Pieces, Kilogram)<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter full name" {...register("full_name")} />
                        {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>}
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
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className=" text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : unit ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
