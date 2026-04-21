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
import { createPartner, Partner, updatePartner } from "@/apiServices/homePageAdminService";
import { Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface OurPartnersFormProps {
  title: string;
  partner?: Partner;
}

interface FormValues {
  title: string;
  partner_type: string;
  status: string;
  image?: FileList;
}

export default function OurPartnersForm({ title, partner }: OurPartnersFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(partner?.image || null);
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
      title: partner?.title || "",
      partner_type: partner ? String(partner.partner_type) : "1",
      status: partner ? partner.status.toString() : "1",
      image: undefined,
    },
  });

  useEffect(() => {
    if (partner) {
      reset({
        title: partner.title || "",
        partner_type: String(partner.partner_type),
        status: partner.status.toString(),
      });
      if (partner.image) {
        setPreviewImage(partner.image);
        setImageRemoved(false);
      } else {
        setPreviewImage(null);
      }
    }
  }, [partner, reset]);

  const imageFile = watch("image");

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
    formData.append("partner_type", values.partner_type);
    formData.append("status", values.status);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    } else if (partner && imageRemoved) {
      // If editing and image was removed, send empty string to delete it
      formData.append("image", "");
    }

    try {
      let res;
      if (partner) {
        res = await updatePartner(Number(partner.id), formData);
      } else {
        res = await createPartner(formData);
      }

      if (res.success) {
        toast.success(res.message || "Partner saved successfully!");
        setPreviewImage(null);
        reset();
        router.push("/web-content/our-partners");
        return;
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save partner");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setError(field as keyof FormValues, { type: "server", message: errorMessage as string });
          });
        } else {
          toast.error(res.message || "Failed to save partner");
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div>
            <Label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Enter title"
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{String(errors.title.message)}</p>}
          </div>
          {/* Partner Type */}
          <div>
            <Label className="block text-sm font-medium mb-1">Partner Type <span className="text-red-500">*</span></Label>
            <Controller
              name="partner_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Partner Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Affiliate</SelectItem>
                    <SelectItem value="2">Concern</SelectItem>
                    <SelectItem value="3">Client</SelectItem>
                    <SelectItem value="4">Member</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.partner_type && <p className="text-sm text-red-500 mt-1">{String(errors.partner_type.message)}</p>}
          </div>
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
            {errors.status && <p className="text-sm text-red-500 mt-1">{String(errors.status.message)}</p>}
          </div>
        </div>


        {/* Image */}
        <div>
          <Label className="block text-sm font-medium mb-1">Image</Label>
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
                  <span className="flex flex-col items-center justify-center gap-2">
                    <span className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-500" />
                    </span>
                    <span className="text-sm font-medium text-gray-900">Click to upload image</span>
                  </span>
                </label>
              </div>
            )}
            {errors.image && <p className="text-sm text-red-500 mt-1">{String(errors.image.message)}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className=" cursor-pointer">
            {isSubmitting ? "Submitting..." : partner ? "Update Partner" : "Add Partner"}
          </Button>
        </div>

      </form>
    </div>
  );
}
