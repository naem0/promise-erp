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
import { useEffect, useRef, useState } from "react";
import {
    createStudentEarning,
    updateStudentEarning,
    StudentEarning,
} from "@/apiServices/studentEarningsService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageIcon, X, Upload, Eye } from "lucide-react";
import StudentSearchSelect from "@/components/common/StudentSearchSelect";
import EarningSiteSearchSelect from "@/components/common/EarningSiteSearchSelect";
import PaymentMethodSearchSelect from "@/components/common/PaymentMethodSearchSelect";
import CareerCategorySearchSelect from "@/components/common/CareerCategorySearchSelect";

interface StudentEarningsFormProps {
    title: string;
    earning?: StudentEarning;
}

interface FormValues {
    user_id: string;
    earning_site_id: string;
    payment_method_id: string;
    career_category_id: string;
    job_title: string;
    amount_bdt: string;
    amount_usd: string;
    earned_at: string;
    status: string;
}

export default function StudentEarningsForm({
    title,
    earning,
}: StudentEarningsFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New image files selected by user
    const [newImages, setNewImages] = useState<File[]>([]);
    // Preview URLs for new images
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    // Existing images from the server (for edit mode)
    const [existingImages, setExistingImages] = useState<string[]>(
        earning?.earning_images || []
    );
    // Image being previewed in a lightbox
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            user_id: "",
            earning_site_id: "",
            payment_method_id: "",
            career_category_id: "",
            job_title: "",
            amount_bdt: "0",
            amount_usd: "0",
            earned_at: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (earning) {
            const earnedDate = earning.earned_at
                ? earning.earned_at.split(" ")[0]
                : "";
            reset({
                user_id: String(earning.user?.id || ""),
                earning_site_id: String(earning.earning_site_id || ""),
                payment_method_id: String(earning.payment_method_id || ""),
                career_category_id: String(earning.career_category_id || ""),
                job_title: earning.job_title || "",
                amount_bdt: String(earning.amount_bdt ?? "0"),
                amount_usd: String(earning.amount_usd ?? "0"),
                earned_at: earnedDate,
                status: String(earning.status ?? "1"),
            });
            setExistingImages(earning.earning_images || []);
        }
    }, [earning, reset]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImagePreviews]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const validFiles = files.filter((file) =>
            file.type.startsWith("image/")
        );

        if (validFiles.length !== files.length) {
            toast.error("Only image files are allowed.");
        }

        const previews = validFiles.map((file) => URL.createObjectURL(file));
        setNewImages((prev) => [...prev, ...validFiles]);
        setNewImagePreviews((prev) => [...prev, ...previews]);

        // Reset input so the same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // Append new image files
        newImages.forEach((file) => {
            formData.append("earning_images[]", file);
        });

        // If editing, send existing image URLs so backend knows which to keep
        if (earning) {
            existingImages.forEach((url) => {
                formData.append("existing_images[]", url);
            });
        }

        try {
            const res = earning
                ? await updateStudentEarning(Number(earning.id), formData)
                : await createStudentEarning(formData);

            if (res.success) {
                reset();
                setNewImages([]);
                setNewImagePreviews([]);
                toast.success(res.message || "Student earning saved successfully!");
                router.push("/lms/student-earnings");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save student earning");
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
                    toast.error(res.message || "Failed to save student earning");
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

    const totalImages = existingImages.length + newImages.length;

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            {/* Lightbox */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh] w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}

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

                    {/* Student (User) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Student<span className="text-red-500"> *</span>
                        </label>
                        <Controller
                            name="user_id"
                            control={control}
                            render={({ field }) => (
                                <StudentSearchSelect
                                    value={field.value || null}
                                    onValueChange={(val) => field.onChange(val ?? "")}
                                    placeholder="Search & select student"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.user_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.user_id.message}</p>
                        )}
                    </div>

                    {/* Earning Site */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Earning Site<span className="text-red-500"> *</span>
                        </label>
                        <Controller
                            name="earning_site_id"
                            control={control}
                            render={({ field }) => (
                                <EarningSiteSearchSelect
                                    value={field.value || null}
                                    onValueChange={(val) => field.onChange(val ?? "")}
                                    placeholder="Search & select earning site"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.earning_site_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.earning_site_id.message}</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Payment Method<span className="text-red-500"> *</span>
                        </label>
                        <Controller
                            name="payment_method_id"
                            control={control}
                            render={({ field }) => (
                                <PaymentMethodSearchSelect
                                    value={field.value || null}
                                    onValueChange={(val) => field.onChange(val ?? "")}
                                    placeholder="Search & select payment method"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.payment_method_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.payment_method_id.message}</p>
                        )}
                    </div>

                    {/* Career Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Career Category<span className="text-red-500"> *</span>
                        </label>
                        <Controller
                            name="career_category_id"
                            control={control}
                            render={({ field }) => (
                                <CareerCategorySearchSelect
                                    value={field.value || null}
                                    onValueChange={(val) => field.onChange(val ?? "")}
                                    placeholder="Search & select career category"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.career_category_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.career_category_id.message}</p>
                        )}
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Job Title<span className="text-red-500"> *</span>
                        </label>
                        <Input
                            placeholder="Enter job title"
                            {...register("job_title")}
                        />
                        {errors.job_title && (
                            <p className="text-sm text-red-500 mt-1">{errors.job_title.message}</p>
                        )}
                    </div>

                    {/* Earned At */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Earned At<span className="text-red-500"> *</span>
                        </label>
                        <Input
                            type="date"
                            {...register("earned_at")}
                        />
                        {errors.earned_at && (
                            <p className="text-sm text-red-500 mt-1">{errors.earned_at.message}</p>
                        )}
                    </div>

                    {/* Amount BDT */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (BDT)<span className="text-red-500"> *</span></label>
                        <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            {...register("amount_bdt")}
                        />
                        {errors.amount_bdt && (
                            <p className="text-sm text-red-500 mt-1">{errors.amount_bdt.message}</p>
                        )}
                    </div>

                    {/* Amount USD */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (USD)<span className="text-red-500"> *</span></label>
                        <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            {...register("amount_usd")}
                        />
                        {errors.amount_usd && (
                            <p className="text-sm text-red-500 mt-1">{errors.amount_usd.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
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
                                        <SelectItem value="0">Pending</SelectItem>
                                        <SelectItem value="1">Verified</SelectItem>
                                        <SelectItem value="2">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Earning Images - full width */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                            Earning Images
                            {totalImages > 0 && (
                                <span className="ml-2 text-xs text-muted-foreground font-normal">
                                    ({totalImages} image{totalImages !== 1 ? "s" : ""} selected)
                                </span>
                            )}
                        </label>

                        {/* Upload Area */}
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-slate-50/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm font-medium text-slate-700">
                                Click to upload images
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                PNG, JPG, WEBP supported &mdash; multiple files allowed
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageSelect}
                        />

                        {/* Existing images (edit mode) */}
                        {existingImages.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                                    Existing Images
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {existingImages.map((url, idx) => (
                                        <div
                                            key={`existing-${idx}`}
                                            className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Existing image ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewImage(url);
                                                    }}
                                                    className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5 text-slate-700" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeExistingImage(idx);
                                                    }}
                                                    className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
                                                >
                                                    <X className="h-3.5 w-3.5 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Newly added image previews */}
                        {newImagePreviews.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                                    New Images
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {newImagePreviews.map((preview, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={preview}
                                                alt={`New image ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewImage(preview);
                                                    }}
                                                    className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5 text-slate-700" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNewImage(idx);
                                                    }}
                                                    className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
                                                >
                                                    <X className="h-3.5 w-3.5 text-white" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 bg-green-500/80 text-white text-[10px] text-center py-0.5">
                                                New
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {totalImages === 0 && (
                            <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
                                <ImageIcon className="h-4 w-4" />
                                <span>No images added yet</span>
                            </div>
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
                            : earning
                            ? "Update"
                            : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
