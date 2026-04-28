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
import { createDesignation, updateDesignation, Designation } from "@/apiServices/designationService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DesignationFormProps {
    title: string;
    designation?: Designation;
}

interface FormValues {
    name: string;
    status: string;
}

export default function DesignationsForm({
    title,
    designation,
}: DesignationFormProps) {
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
            name: designation?.name || "",
            status: designation?.status_text.toLowerCase() === "active" ? "1" : "0",
        },
    });

    const submitHandler = async (values: FormValues) => {
        const payload = {
            name: values.name,
            status: Number(values.status),
        };

        try {
            const res = designation
                ? await updateDesignation(designation.id, payload)
                : await createDesignation(payload);
            
            if (res.success) {
                reset();
                toast.success(res.message || "Designation saved successfully!");
                router.push("/lms/designations");
                router.refresh();
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save designation");
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
                    toast.error(res.message || "Failed to save designation");
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
        <div className="bg-card border rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent cursor-pointer">
                   <span className="text-xl mr-2">←</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <Input 
                            placeholder="Enter designation name (e.g. Software Engineer)" 
                            {...register("name")} 
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
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
                        className="bg-primary hover:bg-primary/90 text-white px-8 rounded-lg cursor-pointer"
                    >
                        {isSubmitting ? "Submitting..." : designation ? "Update Designation" : "Create Designation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
