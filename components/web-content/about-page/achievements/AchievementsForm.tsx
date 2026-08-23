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
import { createAchievement, updateAchievement, Achievement } from "@/apiServices/achievementsService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface AchievementsFormProps {
    title: string;
    item?: Achievement;
}

interface FormValues {
    name: string;
    designation: string;
    title: string;
    description: string;
    status: string;
    image: FileList | null;
}

export default function AchievementsForm({
    title,
    item,
}: AchievementsFormProps) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(item?.image || null);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

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
            name: "",
            designation: "",
            title: "",
            description: "",
            status: "1",
            image: null,
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                name: item.name || "",
                designation: item.designation || "",
                title: item.title || "",
                description: item.description || "",
                status: item.status?.toString() || "1",
                image: null,
            });
            if (item.image) {
                setPreviewUrl(item.image);
            } else {
                setPreviewUrl(null);
            }
            setIsImageRemoved(false);
        }
    }, [item, reset]);

    const imageFile = watch("image");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setIsImageRemoved(false);
            const file = imageFile[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key !== "image" && value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        } else if (isImageRemoved && item) {
            formData.append("image", "");
        }

        // For method spoofing on update
        if (item) {
            formData.append("_method", "PUT");
        }

        try {
            const res = item
                ? await updateAchievement(Number(item.id), formData)
                : await createAchievement(formData);

            if (res?.success) {
                reset();
                setPreviewUrl(null);
                setIsImageRemoved(false);
                toast.success(res.message || "Achievement saved successfully!");
                router.push("/web-content/about-page/achievements");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save achievement");
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
                    toast.error(res.message || "Failed to save achievement");
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

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6" encType="multipart/form-data">
                {/* Image Preview & Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-32 h-32 relative overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50">
                            <Image
                                src={(previewUrl && typeof previewUrl === "string" && previewUrl.trim() !== "") ? previewUrl : "/images/placeholder.png"}
                                alt="Achievement image preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="achievement-image"
                            className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-sm"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="achievement-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image")}
                        />

                        {previewUrl && (
                            <Button
                                type="button"
                                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition shadow-sm h-auto w-auto"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setIsImageRemoved(true);
                                    setValue("image", null);
                                    toast.success("Image removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />
                            </Button>
                        )}
                    </div>
                </div>
                {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Achievement Title<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter achievement title" {...register("title")} />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Designation<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter designation" {...register("designation")} />
                        {errors.designation && <p className="text-sm text-red-500 mt-1">{errors.designation.message}</p>}
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
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
                        <label className="block text-sm font-medium mb-1">Description<span className="text-red-500">*</span></label>
                        <Textarea placeholder="Enter achievement description" {...register("description")} rows={6} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
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
