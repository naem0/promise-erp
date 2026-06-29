"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  CategoriesResponse,
  getCategories,
} from "@/apiServices/categoryService";
import {
  Course,
  createCourse,
  updateCourse,
} from "@/apiServices/courseService";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseAddFormProps {
  title: string;
  initialData?: Course | null;
  setCourseId?: (id: number) => void;
  goNext?: () => void;
  onSuccess?: () => void;
}

interface FormValues {
  category_id: string;
  title: string;
  sub_title: string;
  short_description: string;
  description: string;
  featured_image: FileList | null | string;
  certificate_image: FileList | null | string;
  video_link: string;
  level: string;
  status: string;
  price: number;
  discount: number;
  discount_type: string;
  after_discount: number;
  is_default: string;
  total_seats: number;
  total_live_class: number;
  total_prerecorded_video: number;
  about_support: string;
  course_type: string;
  is_collaboration: string;
  ratings: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_tag: string;
  schema: string;
}

const statusMap: Record<string, string> = {
  Draft: "0",
  Published: "1",
  Archived: "2",
};

const toSelectString = (val: number | null | undefined) => {
  return val === 1 ? "1" : "0";
};

export default function CourseAddForm({
  title,
  setCourseId,
  goNext,
  onSuccess,
  initialData,
}: CourseAddFormProps) {
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [certPreview, setCertPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      category_id: initialData?.category_id?.toString() || "",
      title: initialData?.title || "",
      sub_title: initialData?.sub_title || "",
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      video_link: initialData?.video_link || "",
      level: initialData?.level || "beginner",
      status:
        statusMap[initialData?.status || ""] || initialData?.status || "1",
      price: initialData?.price ? Number(initialData?.price) : 0,
      discount: initialData?.discount ? Number(initialData?.discount) : 0,
      discount_type: initialData?.discount_type || "fixed",
      after_discount: initialData?.after_discount
        ? Number(initialData?.after_discount)
        : 0,
      is_default: toSelectString(initialData?.is_default),
      total_seats: initialData?.total_seats || 0,
      total_live_class: initialData?.total_live_class || 0,
      total_prerecorded_video: initialData?.total_prerecorded_video || 0,
      about_support: initialData?.about_support || "",
      course_type: initialData?.course_type || "free",
      is_collaboration: toSelectString(initialData?.is_collaboration),
      ratings: initialData?.ratings ? Number(initialData?.ratings) : 0,
      certificate_image: initialData?.certificate_image || "",
      featured_image: initialData?.featured_image || "",
      slug: initialData?.slug || "",
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
      meta_tag: initialData?.meta_tag || "",
      schema: initialData?.schema || "",
    },
  });

  useEffect(() => {
    if (typeof initialData?.featured_image === "string") {
      setPreview(initialData.featured_image);
    }
    if (typeof initialData?.certificate_image === "string") {
      setCertPreview(initialData.certificate_image);
    }
  }, [initialData]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: CategoriesResponse = await getCategories();
        if (res?.success && res?.data?.categories) {
          setCategories(res?.data?.categories || []);
        } else {
          toast.error(res.message || "Failed to load categories");
        }
      } catch (error: unknown) {
        console.error("Error fetching categories:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred while fetching categories");
        }
      }
    };
    fetchCategories();
  }, []);

  const watchedPrice = watch("price");
  const watchedDiscount = watch("discount");
  const watchedDiscountType = watch("discount_type");

  useEffect(() => {
    const price = Number(watchedPrice) || 0;
    const discount = Number(watchedDiscount) || 0;
    let finalPrice = price;

    if (watchedDiscountType === "percentage") {
      finalPrice = price - (price * discount) / 100;
    } else {
      finalPrice = price - discount;
    }
    setValue(
      "after_discount",
      finalPrice > 0 ? Number(finalPrice.toFixed(2)) : 0,
    );
  }, [watchedPrice, watchedDiscount, watchedDiscountType, setValue]);

  const handleCourseSubmit = async (formData: FormData) => {
    let res;
    const courseId = Number(initialData?.id) || null;
    try {
      if (courseId) {
        res = await updateCourse(courseId, formData);
      } else {
        res = await createCourse(formData);
      }

      if (res.success) {
        const newCourseId = res.data?.id;
        if (!courseId) {
          toast.success("Course created successfully");

          setCourseId?.(Number(newCourseId));
          reset();
          goNext?.();
        } else {
          toast.success("Course updated successfully");
          onSuccess?.();
        }
      } else {
        if (res.errors) {
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
          toast.error(res.message || "Failed to create course");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create course");
      }
    }
  };

  const submitForm = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("category_id", data.category_id);
    formData.append("title", data.title);
    formData.append("sub_title", data.sub_title || "");
    formData.append("short_description", data.short_description || "");
    formData.append("description", data.description || "");
    // Featured Image Handling
    if (
      data.featured_image instanceof FileList &&
      data.featured_image.length > 0
    ) {
      formData.append("featured_image", data.featured_image[0]);
    } else if (data.featured_image === null) {
      formData.append("featured_image", "");
    }

    // Certificate Image Handling
    if (
      data.certificate_image instanceof FileList &&
      data.certificate_image.length > 0
    ) {
      formData.append("certificate_image", data.certificate_image[0]);
    } else if (data.certificate_image === null) {
      formData.append("certificate_image", "");
    }
    formData.append("video_link", data.video_link || "");
    formData.append("level", data.level);
    formData.append("status", data.status);
    formData.append("price", data.price?.toString() || "0");
    formData.append("discount", data.discount?.toString() || "0");
    formData.append("discount_type", data.discount_type);
    formData.append("is_default", data.is_default);
    formData.append("total_seats", data.total_seats?.toString() || "0");
    formData.append(
      "total_live_class",
      data.total_live_class?.toString() || "0",
    );
    formData.append(
      "total_prerecorded_video",
      data.total_prerecorded_video?.toString() || "0",
    );
    formData.append("about_support", data.about_support || "");
    formData.append("course_type", data.course_type);
    formData.append("is_collaboration", data.is_collaboration);
    formData.append("ratings", data.ratings?.toString() || "0");
    formData.append("slug", data.slug || "");
    formData.append("meta_title", data.meta_title || "");
    formData.append("meta_description", data.meta_description || "");
    formData.append("meta_tag", data.meta_tag || "");
    formData.append("schema", data.schema || "");

    await handleCourseSubmit(formData);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitForm)} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category_id">
                Category<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category_id" className="w-full h-10">
                      <SelectValue placeholder="-- Select Category --" />
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
              <div className="min-h-5">
                {errors.category_id && (
                  <p className="text-red-500 text-sm">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Master React & Next.js"
                {...register("title")}
              />
              <div className="min-h-5">
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub_title">Sub Title</Label>
              <Input
                id="sub_title"
                placeholder="e.g. Learn Laravel from scratch"
                {...register("sub_title")}
              />
              <div className="min-h-5">
                {errors.sub_title && (
                  <p className="text-red-500 text-sm">
                    {errors.sub_title.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="course_type">Course Type</Label>
              <Controller
                name="course_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="course_type" className="w-full h-10">
                      <SelectValue placeholder="Select Course Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="govt">Government</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.course_type && (
                  <p className="text-red-500 text-sm">
                    {errors.course_type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="level" className="w-full h-10">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.level && (
                  <p className="text-red-500 text-sm">{errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="video_link">
                Video Link<span className="text-red-500">*</span>
              </Label>
              <Input
                id="video_link"
                placeholder="https://..."
                {...register("video_link")}
              />
              <div className="min-h-5">
                {errors.video_link && (
                  <p className="text-red-500 text-sm">
                    {errors.video_link.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              placeholder="A brief overview of the course..."
              {...register("short_description")}
            />
            <div className="min-h-5">
              {errors.short_description && (
                <p className="text-red-500 text-sm">
                  {errors.short_description.message}
                </p>
              )}
            </div>
          </div>

          {/* Description (Rich Text) */}
          <div className="grid gap-2 pb-10">
            <Label>Description</Label>
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
            <div className="min-h-5">
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" className="w-full h-10">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Draft</SelectItem>
                      <SelectItem value="1">Published</SelectItem>
                      <SelectItem value="2">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="is_default">Is Default</Label>
              <Controller
                name="is_default"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="is_default" className="w-full h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.is_default && (
                  <p className="text-red-500 text-sm">
                    {errors.is_default.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="is_collaboration">Is Collaboration</Label>
              <Controller
                name="is_collaboration"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="is_collaboration"
                      className="w-full h-10"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.is_collaboration && (
                  <p className="text-red-500 text-sm">
                    {errors.is_collaboration.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ratings">Ratings</Label>
              <Input
                id="ratings"
                type="number"
                step="any"
                min="0"
                max="5"
                placeholder="e.g. 4.5"
                {...register("ratings")}
              />
              <div className="min-h-5">
                {errors.ratings && (
                  <p className="text-red-500 text-sm">
                    {errors.ratings.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Price + Discount Type + Discount + Final Price*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="e.g. 5000"
                {...register("price")}
              />
              <div className="min-h-5">
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount_type">Discount Type </Label>
              <Controller
                name="discount_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="discount_type" className="w-full h-10">
                      <SelectValue placeholder="Select Discount Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="min-h-5">
                {errors.discount_type && (
                  <p className="text-red-500 text-sm">
                    {errors.discount_type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount">
                Discount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                placeholder="e.g. 1000"
                {...register("discount")}
              />
              <div className="min-h-5">
                {errors.discount && (
                  <p className="text-red-500 text-sm">
                    {errors.discount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="after_discount">
                Final Price (After Discount)
              </Label>
              <Input
                id="after_discount"
                type="number"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                {...register("after_discount")}
              />
              <div className="min-h-5">
                {errors.after_discount && (
                  <p className="text-red-500 text-sm">
                    {errors.after_discount.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="total_seats">Total Seats</Label>
              <Input
                id="total_seats"
                type="number"
                placeholder="e.g. 50"
                {...register("total_seats")}
              />
              <div className="min-h-5">
                {errors.total_seats && (
                  <p className="text-red-500 text-sm">
                    {errors.total_seats.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_live_class">Total Live Class</Label>
              <Input
                id="total_live_class"
                type="number"
                placeholder="e.g. 20"
                {...register("total_live_class")}
              />
              <div className="min-h-5">
                {errors.total_live_class && (
                  <p className="text-red-500 text-sm">
                    {errors.total_live_class.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_prerecorded_video">
                Total Prerecorded Video
              </Label>
              <Input
                id="total_prerecorded_video"
                type="number"
                placeholder="e.g. 30"
                {...register("total_prerecorded_video")}
              />
              <div className="min-h-5">
                {errors.total_prerecorded_video && (
                  <p className="text-red-500 text-sm">
                    {errors.total_prerecorded_video.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="about_support">About Support</Label>
            <Textarea
              id="about_support"
              placeholder="e.g. 24/7 support available via email and chat"
              {...register("about_support")}
            />
            <div className="min-h-5">
              {errors.about_support && (
                <p className="text-red-500 text-sm">
                  {errors.about_support.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Featured Image + Certificate Image */}
            <div className="grid gap-2">
              <Label htmlFor="featured_image">Featured Image</Label>
              <Controller
                name="featured_image"
                control={control}
                render={({ field }) => (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="featured_image"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        const file = e.target.files?.[0];
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />
                    {preview ? (
                      <div className="flex justify-between items-center">
                        <div className=" relative w-full h-[100px] overflow-hidden">
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="rounded-md object-contain"
                          />
                        </div>

                        <Button
                          type="button"
                          className=" cursor-pointer"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setPreview(null);
                            field.onChange(null);
                            const fileInput = document.getElementById(
                              "featured_image",
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                            toast.success("Featured image removed successfully");
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="featured_image"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2 text-center h-24"
                      >
                        <Camera className="w-6 h-6 text-gray-500" />
                        <p className="text-sm font-medium text-gray-900">
                          Featured Image
                        </p>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Certificate Image */}
            <div className="grid gap-2">
              <Label htmlFor="certificate_image">Certificate Image</Label>

              <Controller
                name="certificate_image"
                control={control}
                render={({ field }) => (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="certificate_image"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        const file = e.target.files?.[0];
                        if (file) setCertPreview(URL.createObjectURL(file));
                      }}
                    />

                    {certPreview ? (
                      <div className="flex justify-between items-center">
                        <div className=" relative w-full h-[100px] overflow-hidden">
                          <Image
                            src={certPreview}
                            alt="Cert Preview"
                            fill
                            className="rounded-md object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          className=" cursor-pointer"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setCertPreview(null);
                            field.onChange(null);
                            const fileInput = document.getElementById(
                              "certificate_image",
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                            toast.success("Certificate image removed successfully");
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="certificate_image"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2 text-center h-24"
                      >
                        <Camera className="w-6 h-6 text-gray-500" />
                        <p className="text-sm font-medium text-gray-900">
                          Certificate Image
                        </p>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="grid gap-4 border rounded-lg p-4 bg-muted/30">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SEO &amp; Meta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug <span className="text-red-500">*</span> </Label>
                <Input
                  id="slug"
                  placeholder="e.g. my-course-name"
                  {...register("slug")}
                />
           
                <div className="min-h-5">
                  {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  placeholder="e.g. Learn React – Best Course Online"
                  {...register("meta_title")}
                />
                <div className="min-h-5">
                  {errors.meta_title && <p className="text-red-500 text-sm">{errors.meta_title.message}</p>}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                placeholder="A brief SEO-friendly description (150–160 characters recommended)"
                rows={3}
                {...register("meta_description")}
              />
              <div className="min-h-5">
                {errors.meta_description && <p className="text-red-500 text-sm">{errors.meta_description.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meta_tag">Meta Tags</Label>
              <Input
                id="meta_tag"
                placeholder="e.g. react, nextjs, web development"
                {...register("meta_tag")}
              />
              <div className="min-h-5">
                {errors.meta_tag && <p className="text-red-500 text-sm">{errors.meta_tag.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schema">Schema (JSON-LD)</Label>
              <Textarea
                id="schema"
                placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Course",\n  "name": "Course Title",\n  ...\n}\n<\/script>`}
                rows={5}
                className="font-mono text-xs"
                {...register("schema")}
              />
              <div className="min-h-5">
                {errors.schema && <p className="text-red-500 text-sm">{errors.schema.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-40">
              {isSubmitting ? "Submitting..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
