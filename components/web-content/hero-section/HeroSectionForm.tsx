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
import { HeroSection } from "@/apiServices/homePageAdminService";
import { getBranches, Branch } from "@/apiServices/branchService";
import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";

interface HeroSectionFormProps {
  title: string;
  onSubmit: (
    formData: FormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => void | Promise<void>;
  heroSection?: HeroSection;
}

interface FormValues {
  branch_id: string;
  title: string;
  subtitle: string;
  description: string;
  button_text_one: string;
  button_link_one: string;
  button_text_two: string;
  button_link_two: string;
  video_url: string;
  status: string;
  background_image?: FileList;
}

export default function HeroSectionForm({ title, onSubmit, heroSection }: HeroSectionFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(heroSection?.background_image || null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      branch_id: heroSection?.branch?.id?.toString() || "",
      title: heroSection?.title || "",
      subtitle: heroSection?.subtitle || "",
      description: heroSection?.description || "",
      button_text_one: heroSection?.button_text_one || "",
      button_link_one: heroSection?.button_link_one || "",
      button_text_two: heroSection?.button_text_two || "",
      button_link_two: heroSection?.button_link_two || "",
      video_url: heroSection?.video_url || "",
      status: heroSection?.status?.toString() || "1",
      background_image: undefined,
    },
  });

  const imageFile = watch("background_image");

  const setFormError = (field: string, message: string) => {
    setError(field as keyof FormValues, { type: "server", message });
  };

  useEffect(() => {
    getBranches({ per_page: 100 }).then((res) => {
      if (res.success) {
        setBranches(res.data.branches);
      }
    });
  }, []);

  useEffect(() => {
    if (heroSection) {
      reset({
        branch_id: heroSection.branch?.id?.toString() || "",
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        description: heroSection.description || "",
        button_text_one: heroSection.button_text_one || "",
        button_link_one: heroSection.button_link_one || "",
        button_text_two: heroSection.button_text_two || "",
        button_link_two: heroSection.button_link_two || "",
        video_url: heroSection.video_url || "",
        status: heroSection.status.toString(),
      });
      if (heroSection.background_image) setPreviewImage(heroSection.background_image);
    }
  }, [heroSection, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  }, [imageFile]);

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("branch_id", values.branch_id);
    formData.append("title", values.title.trim());
    formData.append("subtitle", values.subtitle.trim());
    formData.append("description", values.description.trim());
    formData.append("button_text_one", values.button_text_one.trim());
    formData.append("button_link_one", values.button_link_one.trim());
    formData.append("button_text_two", values.button_text_two.trim());
    formData.append("button_link_two", values.button_link_two.trim());
    formData.append("video_url", values.video_url.trim());
    formData.append("status", values.status);

    if (values.background_image && values.background_image.length > 0) {
      formData.append("background_image", values.background_image[0]);
    }

    await onSubmit(formData, setFormError, () => {
      reset();
      setPreviewImage(null);
    });
  };

  console.log(errors)

  const handleImageRemove = () => {
    setPreviewImage(null);
    const fileInput = document.getElementById("background_image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-12">
      <div className="w-full bg-card border rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-8 text-center">{title}</h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Branch</label>
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
                          {String(branch.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.branch_id && <p className="text-xs text-red-500">{String(errors.branch_id.message)}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
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
              {errors.status && <p className="text-xs text-red-500">{String(errors.status.message)}</p>}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input placeholder="Enter title" {...register("title")} />
              {errors.title && <p className="text-xs text-red-500">{String(errors.title.message)}</p>}
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Input placeholder="Enter subtitle" {...register("subtitle")} />
              {errors.subtitle && <p className="text-xs text-red-500">{String(errors.subtitle.message)}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter description"
              className="min-h-[100px]"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500">{String(errors.description.message)}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button 1 */}
            <div className="space-y-4 border p-4 rounded-xl bg-muted/30">
              <h3 className="font-medium text-sm border-b pb-2">Primary Button</h3>
              <div className="space-y-2">
                <label className="text-xs font-medium">Button Text</label>
                <Input placeholder="e.g. Browse Courses" {...register("button_text_one")} />
                {errors.button_text_one && <p className="text-xs text-red-500">{String(errors.button_text_one.message)}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Button Link</label>
                <Input placeholder="e.g. /courses" {...register("button_link_one")} />
                {errors.button_link_one && <p className="text-xs text-red-500">{String(errors.button_link_one.message)}</p>}
              </div>
            </div>

            {/* Button 2 */}
            <div className="space-y-4 border p-4 rounded-xl bg-muted/30">
              <h3 className="font-medium text-sm border-b pb-2">Secondary Button</h3>
              <div className="space-y-2">
                <label className="text-xs font-medium">Button Text</label>
                <Input placeholder="e.g. Get Started" {...register("button_text_two")} />
                {errors.button_text_two && <p className="text-xs text-red-500">{String(errors.button_text_two.message)}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Button Link</label>
                <Input placeholder="e.g. /register" {...register("button_link_two")} />
                {errors.button_link_two && <p className="text-xs text-red-500">{String(errors.button_link_two.message)}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (YouTube)</label>
              <Input placeholder="https://www.youtube.com/watch?v=..." {...register("video_url")} />
              {errors.video_url && <p className="text-xs text-red-500">{String(errors.video_url.message)}</p>}
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image</label>

              <div className="space-y-3">
                {previewImage ? (
                  <div className="relative group">
                    <div className="rounded-lg border-2 border-dashed overflow-hidden aspect-video relative">
                      <Image
                        src={previewImage}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleImageRemove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                    <Input
                      id="background_image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register("background_image")}
                    />
                    <label htmlFor="background_image" className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Click to upload background image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or WebP (max. 2MB)</p>
                        </div>
                      </div>
                    </label>

                  </div>
                )}
              </div>
              {errors.background_image && <p className="text-xs text-red-500">{String(errors.background_image.message)}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end" >
            <Button type="submit" disabled={isSubmitting} className=" h-12 text-lg font-semibold cursor-pointer">
              {isSubmitting ? "Submitting..." : heroSection ? "Update Hero Section" : "Create Hero Section"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
