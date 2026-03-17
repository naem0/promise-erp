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
import { useEffect, useState } from "react";
import { CRMCategory, createCRMCategory, updateCRMCategory } from "@/apiServices/crmCategoryService";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
    title: string;
    category?: CRMCategory;
}

interface FormValues {
    name: string;
    description: string;
    status: string;
    image_url?: FileList;
}

export default function CategoriesForm({
    title,
    category,
}: CategoryFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        category?.image_url || null
    );
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
            status: category?.status !== undefined ? category?.status.toString() : "1",
            image_url: undefined,
        },
    });

    const imageFile = watch("image_url");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setIsImageRemoved(false);
            const file = imageFile[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImage(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        }
    }, [imageFile]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("status", values.status);

        if (values.image_url && values.image_url.length > 0) {
            formData.append("image", values.image_url[0]);
        } else if (isImageRemoved && category) {
            formData.append("image", "");
        }

        try {
            const res = category
                ? await updateCRMCategory(Number(category.id), formData)
                : await createCRMCategory(formData);
            if (res.success) {
                reset();
                setPreviewImage(null);
                toast.success(res.message || "Category saved successfully!");
                router.push("/crm/categories");
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

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto font-bold">
                    {"<"}
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Image Preview & Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-32 h-32 relative rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center">
                            <Image
                                src={previewImage || "/images/placeholder.png"}
                                alt="Category preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="category-image"
                            className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="category-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image_url")}
                        />

                        {previewImage && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="absolute top-1 left-1 p-2 h-auto rounded-full"
                                onClick={() => {
                                    setPreviewImage(null);
                                    setIsImageRemoved(true);
                                    setValue("image_url", undefined);
                                    toast.success("Image removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter category name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
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

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea placeholder="Enter category description" {...register("description")} rows={4} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Submitting..." : category ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
