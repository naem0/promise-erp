"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BlogCategory,
  SingleBlogCategoryResponse,
  updateBlogCategory,
  createBlogCategory,
} from "@/apiServices/blogCategoryService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Camera, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface BlogCategoriesFormProps {
  title: string;
  blogCategory?: BlogCategory;
}

interface BlogCategoryFormValues {
  title: string;
  slug: string;
  image?: FileList;
  status: number;
  meta_title: string;
  meta_description: string;
  schema: string;
}

export default function BlogCategoriesForm({
  title,
  blogCategory,
}: BlogCategoriesFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [metaTags, setMetaTags] = useState<string[]>(blogCategory?.meta_tag || []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
  } = useForm<BlogCategoryFormValues>({
    defaultValues: {
      title: blogCategory?.title || "",
      slug: blogCategory?.slug || "",
      status: blogCategory?.status ?? 1,
      meta_title: blogCategory?.meta_title || "",
      meta_description: blogCategory?.meta_description || "",
      schema: blogCategory?.schema || "",
      image: undefined,
    },
  });

  const imageFile = watch("image");

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

  /* ---------- load edit data (async safe) ---------- */
  useEffect(() => {
    if (!blogCategory) return;
    setPreviewImage(blogCategory.image || null);
  }, [blogCategory]);

  /* ---------- image preview ---------- */
  useEffect(() => {
    if (!imageFile || imageFile.length === 0) return;

    const file = imageFile[0];
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [imageFile]);

  /* ---------- submit ---------- */
  const handleFormSubmit = async (data: BlogCategoryFormValues) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("status", String(data.status));
    formData.append("meta_title", data.meta_title || "");
    formData.append("meta_description", data.meta_description || "");
    formData.append("schema", data.schema || "");

    metaTags.forEach((tag) => formData.append("meta_tag[]", tag));

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = blogCategory
        ? await updateBlogCategory(blogCategory.id, formData)
        : await createBlogCategory(formData);

      if (res?.success) {
        toast.success(
          res.message || `Blog category ${blogCategory ? "updated" : "added"} successfully!`,
        );

        reset();
        setPreviewImage(null);

        router.push("/web-content/blog-categories");
        return;
      }

      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          if (messages.length > 0) {
            setError(field as keyof BlogCategoryFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        });
        return;
      }

      toast.error(
        res?.message || `Failed to ${blogCategory ? "update" : "add"} blog category.`,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submit error:", error);
        toast.error(error.message);
        return;
      }
    }
  };

  const handleImageRemove = () => {
    setPreviewImage(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Blog Category Name <span className="text-red-500">*</span>
              </Label>
              <Input {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

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

            <div className="col-span-2 space-y-2">
              <Label>Image</Label>

              {previewImage ? (
                <div className="relative">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-xl object-cover"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={handleImageRemove}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image")}
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Camera className="mx-auto mb-2 text-gray-500" />
                    <p className="text-sm font-medium">Click to upload image</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* SEO Section */}
          <div className="border rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-foreground">SEO Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input placeholder="SEO meta title" {...register("meta_title")} />
                {errors.meta_title && (
                  <p className="text-sm text-red-500">{errors.meta_title.message}</p>
                )}
              </div>

              {/* Meta Tags */}
              <div className="space-y-2">
                <Label>Meta Tags</Label>
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
              <div className="md:col-span-2 space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  placeholder="SEO meta description"
                  {...register("meta_description")}
                  rows={2}
                />
                {errors.meta_description && (
                  <p className="text-sm text-red-500">{errors.meta_description.message}</p>
                )}
              </div>

              {/* Schema */}
              <div className="md:col-span-2 space-y-2">
                <Label>Schema (JSON-LD)</Label>
                <Textarea
                  placeholder='<script type="application/ld+json">...</script>'
                  {...register("schema")}
                  rows={3}
                />
                {errors.schema && (
                  <p className="text-sm text-red-500">{errors.schema.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : blogCategory
                  ? "Update Blog Category"
                  : "Add Blog Category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
