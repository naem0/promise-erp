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
import { useEffect, useState } from "react";
import { createNewsFeed, NewsFeed, updateNewsFeed } from "@/apiServices/homePageAdminService";
import { Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface NewsFeedFormProps {
  title: string;
  newsFeed?: NewsFeed;
}

interface FormValues {
  title: string;
  news_link: string;
  status: string;
  image?: FileList;
}

export default function NewsFeedForm({ title, newsFeed }: NewsFeedFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(newsFeed?.image || null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const router = useRouter();
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
      title: newsFeed?.title || "",
      news_link: newsFeed?.news_link || "",
      status: newsFeed?.status.toString() || "1",
      image: undefined,
    },
  });

  const imageFile = watch("image");

  // Update preview image when newsFeed prop changes (for edit mode)
  useEffect(() => {
    if (newsFeed?.image && newsFeed.image.trim() !== "") {
      setPreviewImage(newsFeed.image);
      setImageRemoved(false);
    } else {
      setPreviewImage(null);
    }
  }, [newsFeed?.image]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
          setImageRemoved(false); // Reset removal flag when new image is selected
        };
        reader.readAsDataURL(file);
      }
    }
  }, [imageFile]);

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("news_link", values.news_link.trim());
    formData.append("status", values.status);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    } else if (newsFeed && imageRemoved) {
      // If editing and image was removed, send empty string to delete it
      formData.append("image", "");
    }

    try {
      let res;
      if (newsFeed) {
        res = await updateNewsFeed(Number(newsFeed?.id), formData);
      } else {
        res = await createNewsFeed(formData);
      }

      if (res.success) {
        toast.success(res.message || "News feed saved successfully!");
        setPreviewImage(null);
        reset();
        router.push("/web-content/news-feeds");
        return;
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save news feed");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setError(field as keyof FormValues, { type: "server", message: errorMessage as string });
          });
        } else {
          toast.error(res.message || "Failed to save news feed");
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

  const handleImageRemove = () => {
    setPreviewImage(null);
    setImageRemoved(true);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    toast.success("Image removed successfully");
  };

  return (
    <div className="w-full bg-card border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <Label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Enter title"
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          {/* News Link */}
          <div>
            <Label className="block text-sm font-medium mb-1">News Link <span className="text-red-500">*</span></Label>
            <Input
              type="url"
              placeholder="https://example.com/news"
              {...register("news_link")}
            />
            {errors.news_link && <p className="text-sm text-red-500 mt-1">{errors.news_link.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <Label className="block text-sm font-medium mb-1">Status <span className="text-red-500">*</span></Label>
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
        </div>

        {/* Image */}
        <div>
          <Label className="block text-sm font-medium mb-1">Image <span className="text-red-500">*</span></Label>
          <div className="space-y-3">
            {previewImage ? (
              <div className="relative">
                <div className="rounded-lg border-2 border-dashed">
                  <Image
                    src={previewImage}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="object-cover rounded-2xl"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={handleImageRemove}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input id="image" type="file" accept="image/*" className="hidden" {...register("image")} />
                <label htmlFor="image" className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                  </div>
                </label>
              </div>
            )}
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className=" cursor-pointer">
            {isSubmitting ? "Submitting..." : newsFeed ? "Update News Feed" : "Add News Feed"}
          </Button>
        </div>

      </form>
    </div>
  );
}
