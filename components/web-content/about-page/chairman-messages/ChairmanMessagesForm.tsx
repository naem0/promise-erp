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
import { createChairmanMessage, updateChairmanMessage, ChairmanMessage } from "@/apiServices/chairmanMessagesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface ChairmanMessagesFormProps {
    title: string;
    item?: ChairmanMessage;
}

interface FormValues {
    name: string;
    designation: string;
    type: string;
    message_title: string;
    message_content: string;
    status: string;
    chairman_image: FileList | null;
}

export default function ChairmanMessagesForm({
    title,
    item,
}: ChairmanMessagesFormProps) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(item?.chairman_image || null);
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
            type: "",
            message_title: "",
            message_content: "",
            status: "1",
            chairman_image: null,
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                name: item.name || "",
                designation: item.designation || "",
                type: item.type?.toString() || "",
                message_title: item.message_title || "",
                message_content: item.message_content || "",
                status: item.status?.toString() || "1",
                chairman_image: null,
            });
            if (item.chairman_image) {
                setPreviewUrl(item.chairman_image);
            } else {
                setPreviewUrl(null);
            }
            setIsImageRemoved(false);
        }
    }, [item, reset]);

    const imageFile = watch("chairman_image");

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
            if (key !== "chairman_image" && value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        if (values.chairman_image && values.chairman_image.length > 0) {
            formData.append("chairman_image", values.chairman_image[0]);
        } else if (isImageRemoved && item) {
            formData.append("chairman_image", "");
        }

        // For method spoofing on update
        if (item) {
            formData.append("_method", "PUT");
        }

        try {
            const res = item
                ? await updateChairmanMessage(Number(item.id), formData)
                : await createChairmanMessage(formData);

            if (res?.success) {
                reset();
                setPreviewUrl(null);
                setIsImageRemoved(false);
                toast.success(res.message || "Chairman message saved successfully!");
                router.push("/web-content/about-page/chairman-messages");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save message");
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
                    toast.error(res.message || "Failed to save message");
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
                                alt="Chairman image preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="chairman-image"
                            className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-sm"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="chairman-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("chairman_image")}
                        />

                        {previewUrl && (
                            <Button
                                type="button"
                                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition shadow-sm h-auto w-auto"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setIsImageRemoved(true);
                                    setValue("chairman_image", null);
                                    toast.success("Image removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />
                            </Button>
                        )}
                    </div>
                </div>
                {errors.chairman_image && <p className="text-sm text-red-500 mt-1">{errors.chairman_image.message}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Type<span className="text-red-500">*</span></label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Chairman</SelectItem>
                                        <SelectItem value="2">Managing Director (MD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
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

                    {/* Message Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Message Title<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter message title" {...register("message_title")} />
                        {errors.message_title && <p className="text-sm text-red-500 mt-1">{errors.message_title.message}</p>}
                    </div>

                    {/* Message Content */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Message Content<span className="text-red-500">*</span></label>
                        <Textarea placeholder="Enter message content" {...register("message_content")} rows={6} />
                        {errors.message_content && <p className="text-sm text-red-500 mt-1">{errors.message_content.message}</p>}
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
