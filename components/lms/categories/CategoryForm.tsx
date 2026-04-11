"use client";

import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, X, Plus } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createCategory,
  updateCategory,
  Category,
} from "@/apiServices/categoryService";

interface CategoryFormProps {
  title: string;
  category?: Category;
}

interface FormValues {
  name: string;
  slug: string;
  status: string;
  image?: FileList;
  meta_title: string;
  meta_description: string;
  schema: string;
}

export default function CategoryForm({ title, category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [previewImage, setPreviewImage] = useState<string | null>(
    category?.image || null
  );
  const [imageRemoved, setImageRemoved] = useState(false);
  const [metaTags, setMetaTags] = useState<string[]>(category?.meta_tag || []);
  const [tagInput, setTagInput] = useState("");

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
      slug: category?.slug || "",
      status: category?.status?.toString() || "1",
      meta_title: category?.meta_title || "",
      meta_description: category?.meta_description || "",
      schema: category?.schema || "",
    },
  });

  const imageFile = watch("image");

  /* ── Load edit data ── */
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug || "",
        status: category.status.toString(),
        meta_title: category.meta_title || "",
        meta_description: category.meta_description || "",
        schema: category.schema || "",
      });
      setPreviewImage(category.image || null);
      setMetaTags(category.meta_tag || []);
    }
  }, [category, reset]);

  /* ── Image preview ── */
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
        setImageRemoved(false);
      }
    }
  }, [imageFile]);

  /* ── Tag helpers ── */
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

  /* ── Submit ── */
  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("slug", values.slug.trim());
    formData.append("status", values.status);
    formData.append("meta_title", values.meta_title || "");
    formData.append("meta_description", values.meta_description || "");
    formData.append("schema", values.schema || "");

    metaTags.forEach((tag) => formData.append("meta_tag[]", tag));

    if (values.image?.length) {
      formData.append("image", values.image[0]);
    } else if (imageRemoved && isEdit) {
      formData.append("image", "");
    }

    try {
      const res = isEdit
        ? await updateCategory(category!.id, formData)
        : await createCategory(formData);

      if (res.success) {
        toast.success( res.message || (isEdit ? "Category updated successfully!" : "Category created successfully!"));
        
        reset();
        setMetaTags([]);
        setPreviewImage(null);
        
        router.push("/lms/categories");
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save category");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            setError(field as keyof FormValues, {
              type: "server",
              message: message as string,
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
    }
  };

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
        <div className="flex justify-start">
          <div className="relative">
            <div className="w-48 h-32 relative rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-muted">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Category image preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Category Image</span>
                </div>
              )}
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
              {...register("image")}
            />

            {previewImage && (
              <Button
                type="button"
                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition"
                onClick={() => {
                  setPreviewImage(null);
                  setImageRemoved(true);
                  setValue("image", undefined);
                  toast.success("Image removed");
                }}
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500 mt-2">{errors.image.message}</p>
          )}
        </div>

        {/* Main Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name<span className="text-red-500">*</span>
            </label>
            <Input {...register("name")} placeholder="Enter a category name" />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <Input
              {...register("slug")}
              placeholder="e.g. web-and-software-development"
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* SEO Section */}
        <div className="border rounded-xl p-5 space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            SEO Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <Input
                placeholder="SEO meta title"
                {...register("meta_title")}
              />
              {errors.meta_title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.meta_title.message}
                </p>
              )}
            </div>

            {/* Meta Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Tags
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <Textarea
                placeholder="SEO meta description"
                {...register("meta_description")}
                rows={2}
              />
              {errors.meta_description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.meta_description.message}
                </p>
              )}
            </div>

            {/* Schema */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Schema (JSON-LD)
              </label>
              <Textarea
                placeholder='<script type="application/ld+json">...</script>'
                {...register("schema")}
                rows={3}
              />
              {errors.schema && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.schema.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
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
            {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}
