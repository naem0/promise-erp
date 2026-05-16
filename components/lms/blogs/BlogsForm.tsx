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
import {
    Blog,
    createBlog,
    updateBlog,
} from "@/apiServices/blogsService";
import { BlogCategory } from "@/apiServices/blogCategoryService";
import { Camera, X, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/lms/courses/RichTextEditor";
import { Badge } from "@/components/ui/badge";

interface BlogFormProps {
    title: string;
    blog?: Blog;
    categories?: BlogCategory[];
}

interface FormValues {
    blog_category_id: string;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    status: string;
    published_at: string;
    meta_title: string;
    meta_description: string;
    schema: string;
    schedule: string;
    thumbnail?: FileList;
}

export default function BlogsForm({
    title,
    blog,
    categories = [],
}: BlogFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        blog?.thumbnail || null
    );
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const [metaTags, setMetaTags] = useState<string[]>(blog?.meta_tag || []);
    const [tagInput, setTagInput] = useState("");
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
            blog_category_id: blog?.category?.id?.toString() || "",
            title: blog?.title || "",
            slug: blog?.slug || "",
            short_description: blog?.short_description || "",
            description: blog?.description || "",
            status: blog?.status?.toString() || "1",
            published_at: blog?.published_at || "",
            meta_title: blog?.meta_title || "",
            meta_description: blog?.meta_description || "",
            schema: blog?.schema || "",
            schedule: blog?.schedule ? blog.schedule.replace(" ", "T").slice(0, 16) : "",
            thumbnail: undefined,
        },
    });

    const imageFile = watch("thumbnail");

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


    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !metaTags.includes(trimmed)) {
            setMetaTags((prev) => [...prev, trimmed]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setMetaTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        formData.append("blog_category_id", values.blog_category_id);
        formData.append("title", values.title);
        formData.append("slug", values.slug);
        formData.append("short_description", values.short_description || "");
        formData.append("description", values.description || "");
        formData.append("status", values.status);
        formData.append("published_at", values.published_at || "");
        formData.append("meta_title", values.meta_title || "");
        formData.append("meta_description", values.meta_description || "");
        formData.append("schema", values.schema || "");

        // Convert datetime-local to "YYYY-MM-DD HH:mm:ss"
        if (values.schedule) {
            const scheduleFormatted = values.schedule.replace("T", " ") + ":00";
            formData.append("schedule", scheduleFormatted);
        }

        // Meta tags array
        metaTags.forEach((tag) => formData.append("meta_tag[]", tag));

        // Thumbnail
        if (values.thumbnail && values.thumbnail.length > 0) {
            formData.append("thumbnail", values.thumbnail[0]);
        } else if (isImageRemoved && blog) {
            formData.append("thumbnail", "");
        }

        // If update, add _method
        if (blog) {
            formData.append("_method", "PUT");
        }

        try {
            const res = blog
                ? await updateBlog(Number(blog.id), formData)
                : await createBlog(formData);

            if (res.success) {
                reset();
                setPreviewImage(null);
                setMetaTags([]);
                toast.success(res.message || "Blog saved successfully!");
                router.push("/lms/blogs");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save blog");
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
                    toast.error(res.message || "Failed to save blog");
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
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                    <span className="text-xl">{"<"}</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Thumbnail Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-48 h-32 relative rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-muted">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Thumbnail preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <Camera className="w-6 h-6" />
                                    <span className="text-xs">Thumbnail</span>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="blog-thumbnail"
                            className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="blog-thumbnail"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("thumbnail")}
                        />

                        {previewImage && (
                            <Button
                                type="button"
                                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition"
                                onClick={() => {
                                    setPreviewImage(null);
                                    setIsImageRemoved(true);
                                    setValue("thumbnail", undefined);
                                    toast.success("Thumbnail removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category<span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="blog_category_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.blog_category_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.blog_category_id.message}</p>
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
                                        <SelectItem value="1">Published</SelectItem>
                                        <SelectItem value="0">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title<span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter blog title" {...register("title")} />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug <span className="text-red-500">*</span></label>
                        <Input placeholder="blog-slug-here" {...register("slug")} />
                        {errors.slug && (
                            <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                        )}
                    </div>

                    {/* Published At */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Published At</label>
                        <Input type="date" {...register("published_at")} />
                        {errors.published_at && (
                            <p className="text-sm text-red-500 mt-1">{errors.published_at.message}</p>
                        )}
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Schedule</label>
                        <Input type="datetime-local" {...register("schedule")} />
                        {errors.schedule && (
                            <p className="text-sm text-red-500 mt-1">{errors.schedule.message}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Short Description</label>
                        <Textarea
                            placeholder="Enter a brief description..."
                            {...register("short_description")}
                            rows={3}
                        />
                        {errors.short_description && (
                            <p className="text-sm text-red-500 mt-1">{errors.short_description.message}</p>
                        )}
                    </div>

                    {/* Description (Rich Text Editor) */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Description<span className="text-red-500">*</span>
                        </label>
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
                </div>

                {/* SEO Section */}
                <div className="border rounded-xl p-5 space-y-4">
                    <h3 className="text-base font-semibold text-foreground">SEO Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Meta Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Meta Title</label>
                            <Input placeholder="SEO meta title" {...register("meta_title")} />
                            {errors.meta_title && (
                                <p className="text-sm text-red-500 mt-1">{errors.meta_title.message}</p>
                            )}
                        </div>

                        {/* Meta Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Meta Tags</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddTag}
                                    className="shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {metaTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {metaTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            {tag}
                                            <X className="w-3 h-3" />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Meta Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Meta Description</label>
                            <Textarea
                                placeholder="SEO meta description"
                                {...register("meta_description")}
                                rows={2}
                            />
                            {errors.meta_description && (
                                <p className="text-sm text-red-500 mt-1">{errors.meta_description.message}</p>
                            )}
                        </div>

                        {/* Schema */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Schema (JSON-LD)</label>
                            <Textarea
                                placeholder='<script type="application/ld+json">...</script>'
                                {...register("schema")}
                                rows={3}
                            />
                            {errors.schema && (
                                <p className="text-sm text-red-500 mt-1">{errors.schema.message}</p>
                            )}
                        </div>
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
                        {isSubmitting ? "Submitting..." : blog ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
