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
import { createFacility, Facility, updateFacility } from "@/apiServices/facilitiesService";
import { Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FacilitiesFormProps {
  title: string;
  facility?: Facility;
}

interface FormValues {
  title: string;
  status: string;
  image?: FileList;
}

export default function FacilitiesForm({ title, facility }: FacilitiesFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(facility?.image || null);
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
      title: facility?.title || "",
      status: facility?.status.toString() || "1",
      image: undefined,
    },
  });

  const imageFile = watch("image");

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
    formData.append("title", values.title.trim());
    formData.append("status", values.status);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      let res
      if (facility) {
        res = await updateFacility(Number(facility.id), formData);
      } else {
        res = await createFacility(formData);
      }

      if (res.success) {
        toast.success(res.message || "Facility added successfully!");
        setPreviewImage(null);
        reset();
        router.push("/lms/facilities");
        return;
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to add facility");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setError(field as keyof FormValues, { type: "server", message: errorMessage as string });
          });
        } else {
          toast.error(res.message || "Failed to add facility");
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
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="mx-auto bg-card border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start ">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="cursor-pointer me-3"
        >
          <span className="text-sm">Go Back</span>
        </Button>
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
      </div>


      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Facility Title</label>
          <Input placeholder="Enter facility title" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors?.title?.message}</p>}
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

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Facility Image</label>
          <div className="space-y-3">
            {previewImage ? (
              <div className="relative">
                <div className="rounded-lg border-2 border-dashed">
                  <Image
                    src={previewImage}
                    alt="Facility preview"
                    width={100}
                    height={100}
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
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? "Submitting..." : facility ? "Update Facility" : "Add Facility"}
          </Button>
        </div>
      </form>
    </div>
  );
}


