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
import { createRolesPowerStep, updateRolesPowerStep, RolesPowerStep } from "@/apiServices/inventoryRolesPowerService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@/apiServices/rolePermissionService";

interface RolesPowerFormProps {
    title: string;
    step?: RolesPowerStep | null;
    roles?: Role[];
}

interface FormValues {
    role_id: string;
    workflow_type: string;
    min_amount: string;
    status: string;
}

const WORKFLOW_TYPE_OPTIONS = [
    { value: "1", label: "Head Office" },
    { value: "2", label: "Branch" },
];

export default function RolesPowerForm({
    title,
    step,
    roles = [],
}: RolesPowerFormProps) {
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
            role_id: "",
            workflow_type: "1",
            min_amount: "0",
            status: "1",
        },
    });

    useEffect(() => {
        if (step) {
            reset({
                role_id: step.role_id?.toString() || "",
                workflow_type: step.workflow_type?.toString() || "1",
                min_amount: step.min_amount?.toString() || "0",
                status: step.status?.toString() || "1",
            });
        }
    }, [step, reset]);

    const submitHandler = async (values: FormValues) => {
        const payload = {
            role_id: Number(values.role_id),
            workflow_type: Number(values.workflow_type),
            min_amount: Number(values.min_amount),
            status: Number(values.status),
        };

        try {
            const res = step
                ? await updateRolesPowerStep(Number(step.id), payload)
                : await createRolesPowerStep(payload);

            if (res.success) {
                reset();
                toast.success(res.message || "Saved successfully!");
                router.push("/inventory/roles-power");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save");
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
                    toast.error(res.message || "Failed to save");
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
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role<span className="text-red-500">*</span></label>
                        <Controller
                            name="role_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles?.length ? (
                                            roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.display_name || role.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-roles" disabled>
                                                No roles available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role_id && <p className="text-sm text-red-500 mt-1">{errors.role_id.message}</p>}
                    </div>

                    {/* Workflow Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Workflow Type<span className="text-red-500">*</span></label>
                        <Controller
                            name="workflow_type"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Workflow Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WORKFLOW_TYPE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.workflow_type && <p className="text-sm text-red-500 mt-1">{errors.workflow_type.message}</p>}
                    </div>

                    {/* Min Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Amount</label>
                        <Input type="number" placeholder="e.g. 5000" {...register("min_amount")} />
                        {errors.min_amount && <p className="text-sm text-red-500 mt-1">{errors.min_amount.message}</p>}
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
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : step ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
