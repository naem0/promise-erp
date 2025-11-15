"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getCategories } from "@/apiServices/categoryService";
import { getBranches } from "@/apiServices/branchService";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/apiServices/courseService";
import Image from "next/image";

interface CourseFormProps {
  title: string;
  onSubmit: (
    formData: FormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => void | Promise<void>;
  initialData?: Course | null;
}

interface FormValues {
  lm_category_id: string;
  title: string;
  sub_title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  featured_image?: FileList; // For file input
  video_link?: string;
  level: string;
  end_date?: string;
  status: string; // "0", "1", "2"
  is_default: boolean;
  branch_ids: number[];
  price?: number;
  discount?: number;
}

export default function CourseAddForm({
  title,
  onSubmit,
  initialData,
}: CourseFormProps) {
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [branches, setBranches] = useState<Array<{ id: number; name: string }>>([]);

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      lm_category_id: initialData?.category?.id.toString() || "",
      title: initialData?.title || "",
      sub_title: initialData?.sub_title || "",
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      video_link: initialData?.video_link || "",
      level: initialData?.level || "beginner",
      status: initialData?.status || "1",
      is_default: initialData?.is_default || false,
      branch_ids: initialData?.branches?.map((b) => b.id) || [],
      price: initialData?.price || 0,
      discount: initialData?.discount || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        lm_category_id: initialData.category?.id.toString() || "",
        title: initialData.title || "",
        sub_title: initialData.sub_title || "",
        short_description: initialData.short_description || "",
        description: initialData.description || "",
        video_link: initialData.video_link || "",
        level: initialData.level || "beginner",
        status: initialData.status || "1",
        is_default: initialData.is_default || false,
        branch_ids: initialData.branches?.map((b) => b.id) || [],
        price: initialData.price || 0,
        discount: initialData.discount || 0,
      });
      if (initialData.featured_image) {
        setPreview(`http://127.0.0.1:8000/${initialData.featured_image}`);
      }
    }
  }, [initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };



  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getBranches();
        if (res.success) setBranches(res.data.branches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  const setFormError = (field: string, message: string) => {
    setError(field as keyof FormValues, { type: "server", message });
  };

  const submitForm = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("lm_category_id", data.lm_category_id);
    formData.append("title", data.title);
    if (data.sub_title) formData.append("sub_title", data.sub_title);
    if (data.short_description) formData.append("short_description", data.short_description);
    if (data.description) formData.append("description", data.description);
    if (data.featured_image && data.featured_image.length > 0) {
      formData.append("featured_image", data.featured_image[0]);
    }
    if (data.video_link) formData.append("video_link", data.video_link);
    formData.append("level", data.level);
    formData.append("status", data.status);
    formData.append("is_default", data.is_default ? "1" : "0");
    data.branch_ids.forEach((id) => formData.append("branch_ids[]", id.toString()));
    if (data.price) formData.append("price", data.price.toString());
    if (data.discount) formData.append("discount", data.discount.toString());

    await onSubmit(formData, setFormError, () => reset());
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitForm)} className="grid gap-6">
          {/* Category and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lm_category_id">
                Category<span className="text-red-500">*</span>
              </Label>
              <select
                id="lm_category_id"
                {...register("lm_category_id", { required: "Category is required" })}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">-- Select a category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.lm_category_id && (
                <span className="text-sm text-red-600">{errors.lm_category_id.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Course Title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <span className="text-sm text-red-600">{errors.title.message}</span>
              )}
            </div>
          </div>

          {/* price and discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Price"
                {...register("price")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                placeholder="Discount"
                {...register("discount")}
              />
            </div>
          </div>

          {/* Sub Title and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sub_title">Sub Title</Label>
              <Input
                id="sub_title"
                placeholder="Course Sub Title"
                {...register("sub_title")}
              />
              {errors.sub_title && (
                <span className="text-sm text-red-600">{errors.sub_title.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <select
                id="level"
                {...register("level")}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && (
                <span className="text-sm text-red-600">{errors.level.message}</span>
              )}
            </div>
          </div>

          {/* Short Description */}
          {/* <div className="grid gap-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              placeholder="A brief description of the course"
              {...register("short_description")}
            />
          {errors.short_description && (
              <span className="text-sm text-red-600">{errors.short_description.message}</span>
            )}
          </div> */}

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Full course description here..."
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-red-600">{errors.description.message}</span>
            )}
          </div>

          {/* Featured Image and Video Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="featured_image">Featured Image</Label>
              <Input
                id="featured_image"
                type="file"
                accept="image/*"
                {...register("featured_image")}
                onChange={handleImageChange}
              />
              {preview && (
                <div className="mt-2">
                  <Image
                    src={preview}
                    alt="Featured Image Preview"
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              {errors.featured_image && (
                <span className="text-sm text-red-600">{errors.featured_image.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video_link">Video Link</Label>
              <Input
                id="video_link"
                placeholder="https://youtube.com/watch?v=example"
                {...register("video_link")}
              />
            </div>
          </div>

          {/* Status and Is Default */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register("status")}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="0">Draft</option>
                <option value="1">Published</option>
                <option value="2">Archived</option>
              </select>
              {errors.status && (
                <span className="text-sm text-red-600">{errors.status.message}</span>
              )}
            </div>
            {/* <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="is_default"
                {...register("is_default")}
              />
              <Label htmlFor="is_default">Mark as Default Course</Label>
              {errors.is_default && (
                <span className="text-sm text-red-600">{errors.is_default.message}</span>
              )}
            </div> */}
          </div>

          {/* Branch IDs (Multi-select Checkboxes) */}
          {/* <div className="grid gap-2">
            <Label>Branches</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`branch-${branch.id}`}
                    value={branch.id}
                    {...register("branch_ids", {
                      setValueAs: (value) =>
                        Array.isArray(value) ? value.map(Number) : [],
                    })}
                  />
                  <Label htmlFor={`branch-${branch.id}`}>{branch.name}</Label>
                </div>
              ))}
            </div>
            {errors.branch_ids && (
              <span className="text-sm text-red-600">{errors.branch_ids.message}</span>
            )}
          </div> */}

          {/* Submit */}
          <div className="flex justify-center">
            <Button
              variant="default"
              size="default"
              type="submit"
              className="w-32"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
