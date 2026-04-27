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
import { useEffect, useRef, useState } from "react";
import {
    Career,
    CareerBranch,
    CareerCategory,
    createCareer,
    updateCareer,
} from "@/apiServices/careerService";
import { Tool } from "@/apiServices/toolsService";
import { Camera, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/lms/courses/RichTextEditor";


interface CareerFormProps {
    title: string;
    career?: Career;
    categories?: CareerCategory[];
    branches?: CareerBranch[];
    allTools?: Tool[];
}

interface FormValues {
    title: string;
    slug: string;
    subtitle: string;
    short_description: string;
    description: string;
    salary: string;
    deadline: string;
    job_type: string;
    location: string;
    status: string;
    career_category_id: string;
    branch_id: string;
    tool_ids: string[];
    meta_title: string;
    meta_description: string;
    meta_tag: string[];
    schema: string;
    image?: FileList;
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CareerForm({
    title,
    career,
    categories = [],
    branches = [],
    allTools = [],
}: CareerFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        career?.image || null
    );
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [metaTags, setMetaTags] = useState<string[]>(
        career?.meta_tag || []
    );
    const [tagInput, setTagInput] = useState("");
    const router = useRouter();
    const slugInputRef = useRef<HTMLInputElement | null>(null);

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
            title: career?.title || "",
            slug: career?.slug || "",
            subtitle: career?.subtitle || "",
            short_description: career?.short_description || "",
            description: career?.description || "",
            salary: career?.salary || "",
            deadline: career?.deadline || "",
            job_type: career?.job_type?.toString() || "1",
            location: career?.location || "",
            status: career?.status?.toString() || "1",
            career_category_id: career?.career_category?.id?.toString() || "",
            branch_id: career?.branch?.id?.toString() || "",
            tool_ids: career?.tools?.map((t) => t.id.toString()) || [],
            meta_title: career?.meta_title || "",
            meta_description: career?.meta_description || "",
            meta_tag: career?.meta_tag || [],
            schema: career?.schema || "",
            image: undefined,
        },
    });

    const imageFile = watch("image");
    const titleValue = watch("title");

    // Auto-generate slug from title (only if not manually edited)
    useEffect(() => {
        if (!isSlugManuallyEdited && titleValue && !career) {
            setValue("slug", generateSlug(titleValue));
        }
    }, [titleValue, isSlugManuallyEdited, setValue, career]);

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

    /* ---------- meta tag handling ---------- */
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/,$/, "");
            if (newTag && !metaTags.includes(newTag)) {
                setMetaTags((prev) => [...prev, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setMetaTags((prev) => prev.filter((t) => t !== tag));
    };

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === "image") return;
            if (key === "tool_ids" && Array.isArray(value)) {
                value.forEach((id) => formData.append("tool_ids[]", id));
                return;
            }
            if (key === "meta_tag") return;
            if (value !== undefined && value !== null && String(value) !== "") {
                formData.append(key, String(value));
            }
        });

        metaTags.forEach((tag) => {
            formData.append("meta_tag[]", tag);
        });

        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        } else if (isImageRemoved && career) {
            formData.append("image", "");
        }

        try {
            const res = career
                ? await updateCareer(Number(career.id), formData)
                : await createCareer(formData);

            if (res.success) {
                reset();
                setPreviewImage(null);
                setMetaTags([]);
                toast.success(res.message || "Career saved successfully!");
                router.push("/lms/careers");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save career");
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
                    toast.error(res.message || "Failed to save career");
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

    const { ref: slugFormRef, ...slugRest } = register("slug");

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="p-0 h-auto"
                >
                    <span className="text-xl">{"<"}</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Image Upload */}
                <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <label
                        htmlFor="career-image"
                        className="relative w-full cursor-pointer"
                    >
                        <div className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 py-8 bg-muted/40 hover:bg-muted/60 transition">
                            {previewImage ? (
                                <div className="relative w-full h-32">
                                    <Image
                                        src={previewImage}
                                        alt="Career image preview"
                                        fill
                                        className="object-contain"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-600 p-1 rounded-full cursor-pointer hover:bg-red-700 transition h-auto"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPreviewImage(null);
                                            setIsImageRemoved(true);
                                            setValue("image", undefined);
                                            toast.success("Image removed");
                                        }}
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-100 rounded-full p-3">
                                        <Camera className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600">
                                        Click to upload image
                                    </span>
                                </>
                            )}
                        </div>
                        <input
                            id="career-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image")}
                        />
                    </label>
                    {errors.image && (
                        <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Title */}
                    <div >
                        <label className="block text-sm font-medium mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter job title" {...register("title")} />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div >
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <Input
                            placeholder="auto-generated-slug"
                            {...slugRest}
                            ref={(e) => {
                                slugFormRef(e);
                                (slugInputRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                            }}
                            onChange={(e) => {
                                setIsSlugManuallyEdited(true);
                                setValue("slug", e.target.value);
                            }}
                        />
                        {errors.slug && (
                            <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                        )}
                    </div>

                    {/* Subtitle */}
                    <div >
                        <label className="block text-sm font-medium mb-1">Subtitle</label>
                        <Input placeholder="Enter subtitle" {...register("subtitle")} />
                        {errors.subtitle && (
                            <p className="text-sm text-red-500 mt-1">{errors.subtitle.message}</p>
                        )}
                    </div>

                    {/* Category & Branch */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="career_category_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.career_category_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.career_category_id.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches?.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id.toString()}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.branch_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>
                        )}
                    </div>

                    {/* Job Type & Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Type</label>
                        <Controller
                            name="job_type"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Full Time</SelectItem>
                                        <SelectItem value="2">Part Time</SelectItem>
                                        <SelectItem value="3">Contractual</SelectItem>
                                        <SelectItem value="4">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.job_type && (
                            <p className="text-sm text-red-500 mt-1">{errors.job_type.message}</p>
                        )}
                    </div>

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

                    {/* Location & Salary */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input placeholder="e.g. Dhaka, Bangladesh" {...register("location")} />
                        {errors.location && (
                            <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Salary</label>
                        <Input placeholder="e.g. 30,000 - 50,000 BDT" {...register("salary")} />
                        {errors.salary && (
                            <p className="text-sm text-red-500 mt-1">{errors.salary.message}</p>
                        )}
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Application Deadline</label>
                        <Input type="date" {...register("deadline")} />
                        {errors.deadline && (
                            <p className="text-sm text-red-500 mt-1">{errors.deadline.message}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Short Description</label>
                        <Controller
                            name="short_description"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.short_description && (
                            <p className="text-sm text-red-500 mt-1">{errors.short_description.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Full Description</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Tools Selection */}
                    {allTools.length > 0 && (
                        <div className="md:col-span-2">
                            <div className="mb-3">
                                <h3 className="text-base font-semibold">Required Tools / Skills</h3>
                                <p className="text-sm text-muted-foreground">Select the tools required for this position</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {allTools.map((tool) => (
                                    <Controller
                                        key={tool.id}
                                        name="tool_ids"
                                        control={control}
                                        render={({ field }) => {
                                            const isChecked = field.value?.includes(tool.id.toString());
                                            return (
                                                <div
                                                    onClick={() => {
                                                        const current = field.value || [];
                                                        const updated = isChecked
                                                            ? current.filter((id) => id !== tool.id.toString())
                                                            : [...current, tool.id.toString()];
                                                        field.onChange(updated);
                                                    }}
                                                    className={`
                                                        group relative flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200
                                                        ${isChecked
                                                            ? "border-green-500 bg-green-50/40"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded border flex items-center justify-center transition-colors mr-3 shrink-0
                                                        ${isChecked ? "bg-green-600 border-green-600" : "bg-white border-gray-300 group-hover:border-gray-400"}
                                                    `}>
                                                        {isChecked && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="mr-2 p-1 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                                                        <Image
                                                            src={tool.image && tool.image !== "" ? tool.image : "/images/placeholder.png"}
                                                            alt={tool.title || "Tool"}
                                                            width={28}
                                                            height={28}
                                                            className="object-contain w-7 h-7"
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-medium truncate ${isChecked ? "text-green-900" : "text-gray-700"}`}>
                                                        {tool.title}
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            {errors.tool_ids && (
                                <p className="text-sm text-red-500 mt-1">{errors.tool_ids.message}</p>
                            )}
                        </div>
                    )}

                    {/* SEO Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-base font-semibold mb-3 pt-2 border-t">SEO / Meta</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Title</label>
                        <Input placeholder="SEO meta title" {...register("meta_title")} />
                        {errors.meta_title && (
                            <p className="text-sm text-red-500 mt-1">{errors.meta_title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Tags</label>
                        <div className="border rounded-md p-2 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-ring">
                            {metaTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="flex items-center gap-1 text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder={
                                    metaTags.length === 0
                                        ? "Type a tag and press Enter or comma..."
                                        : "Add more..."
                                }
                                className="flex-1 min-w-[150px] outline-none bg-transparent text-sm"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Press Enter or comma to add a tag.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <Textarea
                            placeholder="SEO meta description"
                            {...register("meta_description")}
                            rows={3}
                        />
                        {errors.meta_description && (
                            <p className="text-sm text-red-500 mt-1">{errors.meta_description.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Schema</label>
                        <Textarea
                            placeholder="JSON-LD schema markup"
                            {...register("schema")}
                            rows={4}
                            className="font-mono text-sm"
                        />
                        {errors.schema && (
                            <p className="text-sm text-red-500 mt-1">{errors.schema.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-lg border-green-600 text-green-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg"
                    >
                        {isSubmitting ? "Submitting..." : career ? "Update" : "Add Career"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
