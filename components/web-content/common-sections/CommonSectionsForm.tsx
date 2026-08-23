"use client";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  createCommonSection,
  CommonSection,
  updateCommonSection,
} from "@/apiServices/homePageAdminService";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/lms/courses/RichTextEditor";

interface CommonSectionFormProps {
  title: string;
  commonSection?: CommonSection;
}

interface FormValues {
  title: string;
  sub_title: string;
  type: string;
  description: string;
  status: string;
  video_link: string;
  button_text_one: string;
  button_link_one: string;
  button_text_two: string;
  button_link_two: string;
  image?: FileList;
}

const SECTION_TYPES = [
  { value: "none",                    label: "None" },
  { value: "course_category",         label: "Course Category" },
  { value: "service",                 label: "Service" },
  { value: "popular_course",          label: "Popular Course" },
  { value: "govt_course",             label: "Government Course" },
  { value: "opportunity",             label: "Opportunity" },
  { value: "trainer",                 label: "Trainer" },
  { value: "video_gallery",           label: "Video Gallery" },
  { value: "blog",                    label: "Blog" },
  { value: "success_story",           label: "Success Story" },
  { value: "news_feed",               label: "News Feed" },
  { value: "partner",                 label: "Partner" },
  { value: "news_letter",             label: "News Letter" },
  { value: "branch",                  label: "Branch" },
  { value: "why_choose_us",           label: "Why Choose Us" },
  { value: "mission",                 label: "Mission" },
  { value: "vision",                  label: "Vision" },
  { value: "value",                   label: "Value" },
  { value: "about_banner",            label: "About Banner" },
  { value: "blog_banner",             label: "Blog Banner" },
  { value: "blog_details_banner",     label: "Blog Details Banner" },
  { value: "blog_category_banner",    label: "Blog Category Banner" },
  { value: "contact_banner",          label: "Contact Banner" },
  { value: "image_gallery_banner",    label: "Image Gallery Banner" },
  { value: "job_banner",              label: "Job Banner" },
  { value: "job_banner_details",      label: "Job Banner Details" },
  { value: "our_officers_banner",     label: "Our Officers Banner" },
  { value: "privacy_banner",          label: "Privacy Banner" },
  { value: "service_banner",          label: "Service Banner" },
  { value: "success_story_banner",    label: "Success Story Banner" },
  { value: "terms_banner",            label: "Terms Banner" },
  { value: "trainer_banner",          label: "Trainer Banner" },
  { value: "video_gallery_banner",    label: "Video Gallery Banner" },
  { value: "jubo_banner",             label: "Jubo Banner" },
  { value: "jubo_details_banner",     label: "Jubo Details Banner" },
];

export default function CommonSectionForm({
  title,
  commonSection,
}: CommonSectionFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(
    commonSection?.image || null
  );
  const [imageRemoved, setImageRemoved] = useState(false);

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
      title:           commonSection?.title           || "",
      sub_title:       commonSection?.sub_title       || "",
      type:            commonSection?.type            || "none",
      description:     commonSection?.description     || "",
      status:          commonSection?.status?.toString() || "1",
      video_link:      commonSection?.video_link      || "",
      button_text_one: commonSection?.button_text_one || "",
      button_link_one: commonSection?.button_link_one || "",
      button_text_two: commonSection?.button_text_two || "",
      button_link_two: commonSection?.button_link_two || "",
      image:           undefined,
    },
  });

  const imageFile = watch("image");

  // Sync preview when commonSection changes (edit mode)
  useEffect(() => {
    if (commonSection?.image && commonSection.image.trim() !== "") {
      setPreviewImage(commonSection.image);
      setImageRemoved(false);
    } else {
      setPreviewImage(null);
    }
  }, [commonSection?.image]);

  // Generate preview URL when new file is selected
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      setImageRemoved(false);
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();

    formData.append("title",   values.title.trim());
    formData.append("sub_title", values.sub_title.trim());
    formData.append("type",    values.type);
    formData.append("status",  values.status);

    formData.append("description", values.description || "");
    formData.append("video_link", (values.video_link || "").trim());
    formData.append("button_text_one", (values.button_text_one || "").trim());
    formData.append("button_link_one", (values.button_link_one || "").trim());
    formData.append("button_text_two", (values.button_text_two || "").trim());
    formData.append("button_link_two", (values.button_link_two || "").trim());

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    } else if (commonSection && imageRemoved) {
      formData.append("image", "");
    }

    // Method spoofing for update
    if (commonSection) {
      formData.append("_method", "PUT");
    }

    try {
      const res = commonSection
        ? await updateCommonSection(Number(commonSection.id), formData)
        : await createCommonSection(formData);

      if (res.success) {
        toast.success(res.message || "Common section saved successfully!");
        if (!commonSection) {
          reset();
          setPreviewImage(null);
          setImageRemoved(false);
        }
        router.push("/web-content/common-sections");
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save common section");
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
          toast.error(res.message || "Failed to save common section");
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

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Image Preview & Upload */}
        <div className="flex justify-start">
          <div className="relative">
            <div className="w-32 h-32 relative overflow-hidden border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50">
              <Image
                src={(previewImage && typeof previewImage === "string" && previewImage.trim() !== "") ? previewImage : "/images/placeholder.png"}
                alt="Section image preview"
                fill
                className="object-cover"
              />
            </div>
            <label
              htmlFor="section-image"
              className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-white" />
            </label>
            <input
              id="section-image"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image")}
            />

            {previewImage && (
              <Button
                type="button"
                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition shadow-sm h-auto w-auto"
                onClick={() => {
                  setPreviewImage(null);
                  setImageRemoved(true);
                  setValue("image", undefined);
                  const fileInput = document.getElementById(
                    "section-image"
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                  toast.success("Image removed");
                }}
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
        </div>
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}

        {/* Type & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Type — searchable combobox */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={SECTION_TYPES}
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value ?? "none")}
                  placeholder="Select type"
                  searchPlaceholder="Search type..."
                  className="w-full"
                />
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Enter title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* Sub Title */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            Sub Title <span className="text-red-500">*</span>
          </Label>
          <Textarea
            placeholder="Enter sub title"
            {...register("sub_title")}
            rows={2}
          />
          {errors.sub_title && (
            <p className="text-sm text-red-500 mt-1">
              {errors.sub_title.message}
            </p>
          )}
        </div>

        {/* Description (Rich Text) */}
        <div className="grid gap-2 pb-10">
          <Label className="block text-sm font-medium mb-1">
            Description (Optional)
          </Label>
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

        {/* Button One */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Button Text One (Optional)
            </Label>
            <Input
              placeholder="Button text"
              {...register("button_text_one")}
            />
            {errors.button_text_one && (
              <p className="text-sm text-red-500 mt-1">
                {errors.button_text_one.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">
              Button Link One (Optional)
            </Label>
            <Input
              placeholder="https://example.com"
              {...register("button_link_one")}
            />
            {errors.button_link_one && (
              <p className="text-sm text-red-500 mt-1">
                {errors.button_link_one.message}
              </p>
            )}
          </div>
        </div>

        {/* Button Two */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Button Text Two (Optional)
            </Label>
            <Input
              placeholder="Button text"
              {...register("button_text_two")}
            />
            {errors.button_text_two && (
              <p className="text-sm text-red-500 mt-1">
                {errors.button_text_two.message}
              </p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">
              Button Link Two (Optional)
            </Label>
            <Input
              placeholder="https://example.com"
              {...register("button_link_two")}
            />
            {errors.button_link_two && (
              <p className="text-sm text-red-500 mt-1">
                {errors.button_link_two.message}
              </p>
            )}
          </div>
        </div>

        {/* Video Link & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Video Link */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Video Link (Optional)
            </Label>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("video_link")}
            />
            {errors.video_link && (
              <p className="text-sm text-red-500 mt-1">
                {errors.video_link.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </Label>
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

        {/* Actions */}
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
              : commonSection
              ? "Update"
              : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}
