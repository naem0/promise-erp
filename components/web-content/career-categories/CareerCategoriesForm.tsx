"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    CareerCategory,
    createCareerCategory,
    updateCareerCategory,
} from "@/apiServices/careerCategoryService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CareerCategoriesFormProps {
    title: string;
    careerCategory?: CareerCategory;
}

interface CareerCategoryFormValues {
    name: string;
    slug: string;
    status: number;
    meta_title: string;
    meta_description: string;
    schema: string;
}

export default function CareerCategoriesForm({
    title,
    careerCategory,
}: CareerCategoriesFormProps) {
    const router = useRouter();
    const [metaTags, setMetaTags] = useState<string[]>(
        careerCategory?.meta_tag || []
    );
    const [tagInput, setTagInput] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm<CareerCategoryFormValues>({
        defaultValues: {
            name: careerCategory?.name || "",
            slug: careerCategory?.slug || "",
            status: careerCategory?.status ?? 1,
            meta_title: careerCategory?.meta_title || "",
            meta_description: careerCategory?.meta_description || "",
            schema: careerCategory?.schema || "",
        },
    });

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

    /* ---------- submit ---------- */
    const handleFormSubmit = async (data: CareerCategoryFormValues) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("status", String(data.status));
        formData.append("meta_title", data.meta_title);
        formData.append("meta_description", data.meta_description);
        if (data.schema) {
            formData.append("schema", data.schema);
        }
        metaTags.forEach((tag) => {
            formData.append("meta_tag[]", tag);
        });

        try {
            const res = careerCategory
                ? await updateCareerCategory(careerCategory.id, formData)
                : await createCareerCategory(formData);

            if (res?.success) {
                toast.success(
                    res.message ||
                    `Career category ${careerCategory ? "updated" : "added"} successfully!`
                );
                reset();
                setMetaTags([]);
                router.push("/web-content/career-categories");
                return;
            }

            if (res?.errors) {
                Object.entries(res.errors).forEach(([field, messages]) => {
                    const msgArr = Array.isArray(messages) ? messages : [messages];
                    if (msgArr.length > 0) {
                        setError(field as keyof CareerCategoryFormValues, {
                            type: "server",
                            message: msgArr[0],
                        });
                    }
                });
                return;
            }

            toast.error(
                res?.message ||
                `Failed to ${careerCategory ? "update" : "add"} career category.`
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Submit error:", error);
                toast.error(error.message);
            }
        }
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label>
                                Career Category Name <span className="text-red-500">*</span>
                            </Label>
                            <Input {...register("name")} />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label>
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                {...register("slug")}
                                placeholder="e.g. software-development"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug.message}</p>
                            )}
                        </div>


                        {/* Meta Title */}
                        <div className="space-y-2">
                            <Label>Meta Title</Label>
                            <Input {...register("meta_title")} />
                            {errors.meta_title && (
                                <p className="text-sm text-red-500">
                                    {errors.meta_title.message}
                                </p>
                            )}
                        </div>

                        {/* Meta Description */}
                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <Input {...register("meta_description")} />
                            {errors.meta_description && (
                                <p className="text-sm text-red-500">
                                    {errors.meta_description.message}
                                </p>
                            )}
                        </div>

                        {/* Meta Tags */}
                        <div className="space-y-2">
                            <Label>Meta Tags</Label>
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
                            <p className="text-xs text-muted-foreground">
                                Press Enter or comma to add a tag.
                            </p>
                        </div>

                          {/* Status */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={String(field.value)}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                    >
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
                        </div>

                        {/* Schema */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label>Schema</Label>
                            <Textarea
                                {...register("schema")}
                                placeholder="Enter schema markup (JSON-LD, etc.)"
                                rows={4}
                                className="font-mono text-sm"
                            />
                            {errors.schema && (
                                <p className="text-sm text-red-500">{errors.schema.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Submitting..."
                                : careerCategory
                                    ? "Update Career Category"
                                    : "Add Career Category"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
