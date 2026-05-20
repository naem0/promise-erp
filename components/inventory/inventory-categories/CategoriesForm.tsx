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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { createProductCategory, updateProductCategory, ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoriesFormProps {
    title: string;
    category?: ProductCategory;
    categories?: ProductCategory[];
}

interface FormValues {
    name: string;
    description: string;
    parent_id: string;
    status: string;
}

export default function CategoriesForm({
    title,
    category,
    categories = [],
}: CategoriesFormProps) {
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
            description: "",
            parent_id: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                description: category.description || "",
                parent_id: category.parent_id?.toString() || "",
                status: category.status?.toString() || "1",
            });
        }
    }, [category, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const res = category
                ? await updateProductCategory(Number(category.id), formData)
                : await createProductCategory(formData);
                
            if (res.success) {
                reset();
                toast.success(res.message || "Category saved successfully!");
                router.push("/inventory/inventory-categories");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save category");
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
                    toast.error(res.message || "Failed to save category");
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

    // Filter out the current category and its children to prevent circular reference
    // For simplicity, we just filter out the current category here.
    const availableParents = categories.filter(c => c.id !== category?.id);

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
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter category name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Parent Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Parent Category</label>
                        <Controller
                            name="parent_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Parent Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">None (Root)</SelectItem>
                                        {availableParents.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.parent_id && <p className="text-sm text-red-500 mt-1">{errors.parent_id.message}</p>}
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

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea placeholder="Enter description" {...register("description")} rows={4} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg  cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className=" text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : category ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
