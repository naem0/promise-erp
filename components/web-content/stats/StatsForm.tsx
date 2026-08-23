"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createStat,
  updateStat,
  SingleStatsResponse,
  Stats,
} from "@/apiServices/statsService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface StatsFormValues {
  title: string;
  count: string;
  type: "achievement_stat" | "hero_stat" | "opportunity_stat" | "";
  image: FileList | null;
  status: string;
}

interface StatsFormProps {
  title: string;
  stats?: Stats;
  item?: Stats;
}

export default function StatsForm({
  title,
  stats,
  item,
}: StatsFormProps) {
  const router = useRouter();
  const activeItem = item || stats;

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    activeItem?.image || null
  );
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
    setValue,
  } = useForm<StatsFormValues>({
    defaultValues: {
      title: "",
      count: "",
      type: "",
      status: "1",
      image: null,
    },
  });

  useEffect(() => {
    if (activeItem) {
      reset({
        title: activeItem.title || "",
        count: activeItem.count || "",
        type: (activeItem.type as any) || "",
        status: activeItem.status?.toString() || "1",
        image: null,
      });
      if (activeItem.image) {
        setPreviewUrl(activeItem.image);
      } else {
        setPreviewUrl(null);
      }
      setIsImageRemoved(false);
    }
  }, [activeItem, reset]);

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      setIsImageRemoved(false);
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const submitHandler = async (values: StatsFormValues) => {
    if (!values.type) {
      setError("type", { type: "manual", message: "Type is required" });
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null && value !== "") {
        formData.append(key, value as string);
      }
    });

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    } else if (isImageRemoved && activeItem) {
      formData.append("image", "");
    }

    if (activeItem) {
      formData.append("_method", "PUT");
    }

    try {
      const res: SingleStatsResponse = activeItem
        ? await updateStat(activeItem.id, formData)
        : await createStat(formData);

      if (res?.success) {
        reset();
        setPreviewUrl(null);
        setIsImageRemoved(false);
        toast.success(res.message || `Stats ${activeItem ? "updated" : "added"} successfully!`);
        router.push("/web-content/stats");
      } else {
        if (res?.errors) {
          toast.error(res.message || "Failed to save stats.");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages)
              ? messages[0]
              : messages;
            setError(field as keyof StatsFormValues, {
              type: "server",
              message: errorMessage as string,
            });
          });
        } else {
          toast.error(res?.message || `Failed to ${activeItem ? "update" : "add"} stats.`);
        }
      }
    } catch (error: unknown) {
      console.error("Error in submitHandler:", error);
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
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Go Back
        </Button>
        {title}
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6" encType="multipart/form-data">
        {/* Image Preview & Upload */}
        <div className="flex justify-start">
          <div className="relative">
            <div className="w-32 h-32 relative overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50">
              <Image
                src={(previewUrl && typeof previewUrl === "string" && previewUrl.trim() !== "") ? previewUrl : "/images/placeholder.png"}
                alt="Stats image preview"
                fill
                className="object-cover"
              />
            </div>
            <label
              htmlFor="stats-image"
              className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-white" />
            </label>
            <input
              id="stats-image"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image")}
            />

            {previewUrl && (
              <Button
                type="button"
                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition shadow-sm h-auto w-auto"
                onClick={() => {
                  setPreviewUrl(null);
                  setIsImageRemoved(true);
                  setValue("image", null);
                  toast.success("Image removed");
                }}
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
        </div>
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Count<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter count"
              {...register("count", { required: "Count is required" })}
            />
            {errors.count && (
              <p className="text-sm text-red-500 mt-1">{errors.count.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Type<span className="text-red-500">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achievement_stat">Achievement Stat</SelectItem>
                    <SelectItem value="hero_stat">Hero Stat</SelectItem>
                    <SelectItem value="opportunity_stat">Opportunity Stat</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
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
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

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
              : activeItem
                ? "Update"
                : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}
