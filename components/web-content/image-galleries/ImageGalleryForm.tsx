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
import { useState } from "react";
import { createImageGallery, ImageGallery, updateImageGallery } from "@/apiServices/homePageAdminService";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ImageGalleryFormProps {
  title: string;
  imageGallery?: ImageGallery;
}

interface FormValues {
  title: string;
  type: string;
  status: string;
}

export default function ImageGalleryForm({ title, imageGallery }: ImageGalleryFormProps) {
  const [newPreviewImages, setNewPreviewImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(imageGallery?.images || []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: imageGallery?.title || "",
      type: imageGallery?.type?.toString() || "1",
      status: imageGallery?.status?.toString() || "1",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setNewFiles((prev) => [...prev, ...fileArray]);

      fileArray.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setNewPreviewImages((prev) => [...prev, ev.target?.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    e.target.value = "";
  };

  const handleRemoveNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviewImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("New image removed");
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Existing image removed");
  };

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("type", values.type);
    formData.append("status", values.status);

    // Append new image files
    newFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    // For update: send remaining existing image URLs so backend keeps them
    if (imageGallery) {
      existingImages.forEach((url) => {
        formData.append("old_images[]", url);
      });
    }

    try {
      let res;
      if (imageGallery) {
        res = await updateImageGallery(Number(imageGallery.id), formData);
      } else {
        res = await createImageGallery(formData);
      }

      if (res.success) {
        toast.success(res.message || "Image gallery saved successfully!");
        setNewPreviewImages([]);
        setNewFiles([]);
        reset();
        router.push("/web-content/image-galleries");
        return;
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save image gallery");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setError(field as keyof FormValues, { type: "server", message: errorMessage as string });
          });
        } else {
          toast.error(res.message || "Failed to save image gallery");
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
    <div className="max-w-md mx-auto bg-card border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            placeholder="Enter gallery title"
            {...register("title")}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Gallery</SelectItem>
                  <SelectItem value="2">Achievement</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
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
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <div className="space-y-3">

            {/* Existing images (removable with toast) */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Existing Images ({existingImages.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <div className="rounded-lg border-2 border-solid border-green-300 overflow-hidden">
                        <Image
                          src={img}
                          alt={`Existing ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-24 rounded-lg"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images preview (removable with toast) */}
            {newPreviewImages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">New Images ({newPreviewImages.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {newPreviewImages.map((img, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="rounded-lg border-2 border-dashed border-blue-300 overflow-hidden">
                        <Image
                          src={img}
                          alt={`New ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-24 rounded-lg"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                id="gallery_images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="gallery_images" className="cursor-pointer block">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload images</p>
                  <p className="text-xs text-muted-foreground">You can select multiple images</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
          {isSubmitting ? "Submitting..." : imageGallery ? "Update Image Gallery" : "Add Image Gallery"}
        </Button>
      </form>
    </div>
  );
}
