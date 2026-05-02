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
import { useEffect, useState } from "react";
import { createTool, updateTool, Tool } from "@/apiServices/toolsService";
import { Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToolFormProps {
    title: string;
    tool?: Tool;
}

interface FormValues {
    title: string;
    sub_title: string;
    status: string;
    image?: FileList;
}

export default function ToolsForm({ title, tool }: ToolFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        tool?.image || null
    );
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            title: tool?.title || "",
            sub_title: tool?.sub_title || "",
            status: tool?.status?.toString() || "1",
            image: undefined,
        },
    });

    const imageFile = watch("image");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
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
        formData.append("title", values.title.trim());
        formData.append("sub_title", values.sub_title.trim());
        formData.append("status", values.status);

        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        }

        try {
            let res;
            if (tool) {
                res = await updateTool(Number(tool.id), formData);
            } else {
                res = await createTool(formData);
            }

            if (res.success) {
                toast.success(res.message || "Tool saved successfully!");
                setPreviewImage(null);
                reset();
                router.push("/lms/tools");
                return;
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save tool");
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
                    toast.error(res.message || "Failed to save tool");
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

    const handleImageRemove = () => {
        setPreviewImage(null);
        if (typeof window !== "undefined") {
            const fileInput = document.getElementById("tool-image") as HTMLInputElement | null;
            if (fileInput) {
                fileInput.value = "";
            }
        }
        toast.success("Image removed Successfully!");
    };

    return (
        <div className="w-full mx-auto bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-3 mb-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    className=" cursor-pointer"
                >
                    <span>Go Back</span>
                </Button>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tool Title</label>
                    <Input placeholder="Enter tool title" {...register("title")} />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Sub Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Sub Title</label>
                    <Input
                        placeholder="Enter tool sub title"
                        {...register("sub_title")}
                    />
                    {errors.sub_title && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.sub_title.message}
                        </p>
                    )}
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
                    {errors.status && (
                        <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                    )}
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tool Image</label>
                    <div className="space-y-3">
                        {previewImage ? (
                            <div className="relative">
                                <div className="rounded-lg border-2 border-dashed">
                                    <Image
                                        src={previewImage}
                                        alt="Tool preview"
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-2xl"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 cursor-pointer"
                                    onClick={handleImageRemove}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Input
                                    id="tool-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...register("image")}
                                />
                                <label htmlFor="tool-image" className="cursor-pointer block">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Camera className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Click to upload image
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}
                        {errors.image && (
                            <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        {isSubmitting ? "Submitting..." : tool ? "Update Tool" : "Add Tool"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
