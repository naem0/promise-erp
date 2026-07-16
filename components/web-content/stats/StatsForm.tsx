"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addStats,
  updateStats,
  SingleStatsResponse,
  Stats,
} from "@/apiServices/statsService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import Image from "next/image";

interface StatsFormValues {
  title: string;
  count: number;
  type: "achievement_stat" | "hero_stat" | "opportunity_stat" | "";
  image?: FileList;
  status: number;
}

interface StatsFormProps {
  title: string;
  stats?: Stats;
}

export default function StatsForm({
  title,
  stats,
}: StatsFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(
    stats?.image || null
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
  } = useForm<StatsFormValues>({
    defaultValues: {
      title: stats?.title || "",
      count: stats?.count || 0,
      type: stats?.type || "",
      status: stats?.status ?? 1,
      image: undefined,
    },
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (stats) {
      reset({
        title: stats.title,
        count: stats.count,
        type: stats.type,
        status: stats.status,
      });
      if (stats.image) setPreviewImage(stats.image);
    }
  }, [stats, reset]);

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

  const handleFormSubmit = async (data: StatsFormValues) => {
    if (!data.type) {
      setError("type", { type: "manual", message: "Type is required" });
      return;
    }

    const formData = new FormData();

    // Map fields to API payload
    formData.append("title", String(data.title));
    formData.append("count", String(data.count ?? 0));
    formData.append("type", String(data.type));
    formData.append("status", String(data.status));

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const res: SingleStatsResponse = stats
        ? await updateStats(stats.id, formData)
        : await addStats(formData);

      if (res?.success) {
        toast.success(res.message || `Stats ${stats ? "updated" : "added"} successfully!`);
        reset();
        setPreviewImage(null);
        router.push("/web-content/stats");
      } else if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          if (messages.length > 0) {
            const message = messages[0];
            
            setError(field as keyof StatsFormValues, {
              type: "server",
              message,
            });
          }
        });
      } else {
        toast.error(res?.message || `Failed to ${stats ? "update" : "add"} stats.`);
      }
    } catch (error: unknown) {
      console.error("Error in handleFormSubmit:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleImageRemove = () => {
    setPreviewImage(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xl text-slate-800">{title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="title" 
                placeholder="Enter title"
                {...register("title", { required: "Title is required" })} 
                className="focus-visible:ring-emerald-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="count" className="text-sm font-medium text-slate-700">
                Count <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="count" 
                type="number" 
                placeholder="0"
                {...register("count", { required: "Count is required" })} 
                className="focus-visible:ring-emerald-500"
              />
              {errors.count && (
                <p className="text-red-500 text-xs mt-1">{errors.count.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-slate-700">
                Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className={`w-full ${errors.type ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}>
                      <SelectValue placeholder="Select type" />
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
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <SelectTrigger className="w-full focus:ring-emerald-500">
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
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="image" className="text-sm font-medium text-slate-700">Image</Label>
            <div className="space-y-3">
              {previewImage ? (
                <div className="relative w-fit">
                  <div className="rounded-lg border-2 border-dashed border-slate-200 p-2">
                    <Image
                      src={previewImage || "/images/placeholder.png"}
                      alt="Stats preview"
                      width={120}
                      height={120}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1.5 transition-colors cursor-pointer"
                    onClick={handleImageRemove}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors rounded-lg p-6 text-center">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image")}
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload image
                      </p>
                      <p className="text-xs text-slate-400">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </label>
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
            >
              {isSubmitting
                ? "Submitting..."
                : stats
                  ? "Update Stats" 
                  : "Add Stats"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
