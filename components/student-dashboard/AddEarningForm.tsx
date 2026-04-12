"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { ArrowLeft, DollarSign, X, Upload } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getAllJobTitlesForEarning,
  addStudentEarning,
  JobTitleEarningItem,
} from "@/apiServices/studentDashboardService";
import Image from "next/image";

/* =======================
   Types
======================= */
interface AddEarningFormValues {
  earning_site_id: number;
  payment_method_id: number;
  career_category_id: number;
  amount_usd: number | null;
  amount_bdt: number | null;
  earned_at: string;
  earning_images: FileList;
}

/* =======================
   Component
======================= */
const AddEarningForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [isPending, startTransition] = useTransition();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [marketplaces, setMarketplaces] = useState<JobTitleEarningItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<JobTitleEarningItem[]>(
    [],
  );
  const [jobTitles, setJobTitles] = useState<JobTitleEarningItem[]>([]);

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<AddEarningFormValues>({
    defaultValues: {
      earning_site_id: undefined,
      payment_method_id: undefined,
      career_category_id: undefined,
      amount_usd: null,
      amount_bdt: null,
      earned_at: "",
      earning_images: undefined,
    },
  });

  // Watch select fields to clear errors when they change
  const watchedEarningSiteId = watch("earning_site_id");
  const watchedPaymentMethodId = watch("payment_method_id");
  const watchedJobTitleId = watch("career_category_id");
  const watchedEarningImages = watch("earning_images");

  /* =======================
     Image Preview Logic
  ======================= */
  useEffect(() => {
    if (!watchedEarningImages || watchedEarningImages.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const files = Array.from(watchedEarningImages);
    const newPreviewUrls: string[] = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });

    setPreviewUrls(newPreviewUrls);

    // Cleanup function
    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [watchedEarningImages]);

  /* =======================
     Remove Image Preview
  ======================= */
  const removeImage = (index: number) => {
    if (!watchedEarningImages) return;

    const files = Array.from(watchedEarningImages);
    files.splice(index, 1);

    // Create a new FileList-like structure
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    // Update form value
    setValue("earning_images", dataTransfer.files);

    // Remove preview URL
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  /* =======================
     Clear errors when select values change
  ======================= */
  useEffect(() => {
    if (watchedEarningSiteId && errors.earning_site_id) {
      clearErrors("earning_site_id");
    }
  }, [watchedEarningSiteId, errors.earning_site_id, clearErrors]);

  useEffect(() => {
    if (watchedPaymentMethodId && errors.payment_method_id) {
      clearErrors("payment_method_id");
    }
  }, [watchedPaymentMethodId, errors.payment_method_id, clearErrors]);

  useEffect(() => {
    if (watchedJobTitleId && errors.career_category_id) {
      clearErrors("career_category_id");
    }
  }, [watchedJobTitleId, errors.career_category_id, clearErrors]);

  /* =======================
     Fetch dropdown data
  ======================= */
  useEffect(() => {
    if (!token) return;

    const fetchDropdowns = async () => {
      try {
        const res = await getAllJobTitlesForEarning(token);
        if (!res || !res.success || !res.data) {
          console.error("Failed to fetch dropdowns");
          return;
        }
        if (res?.success) {
          setMarketplaces(res.data?.marketplaces || []);
          setPaymentMethods(res.data?.payment_methods || []);
          setJobTitles(res.data?.job_titles || []);
        } else {
         console.error("Failed to fetch dropdowns:", res.message || "Unknown error");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Dropdown fetch error:", error.message);
        } else {
          console.error("Dropdown fetch error:", error);
        }
      }
    };

    fetchDropdowns();
  }, [token]);

  /* =======================
     Submit
  ======================= */
  const onSubmit = (values: AddEarningFormValues) => {
    if (!token) return;

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("earning_site_id", String(values.earning_site_id));
        formData.append("payment_method_id", String(values.payment_method_id));
        formData.append("career_category_id", String(values.career_category_id));
        formData.append("amount_usd", String(values.amount_usd));
        formData.append("amount_bdt", String(values.amount_bdt));
        formData.append("earned_at", values.earned_at);

        Array.from(values.earning_images || []).forEach((file) => {
          formData.append("earning_images[]", file);
        });

        const res = await addStudentEarning(formData, token);

        if (!res.success && res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            setError(field as keyof AddEarningFormValues, {
              type: "server",
              message: messages[0],
            });
          });
          return;
        }

        toast.success(res.message || "Earning added successfully");

        // Cleanup preview URLs
        previewUrls.forEach((url) => URL.revokeObjectURL(url));

        reset({
          earning_site_id: undefined,
          payment_method_id: undefined,
          career_category_id: undefined,
          amount_usd: null,
          amount_bdt: null,
          earned_at: "",
          earning_images: undefined,
        });
        setPreviewUrls([]);

        setTimeout(() => {
          router.push("/student/myearnings/all-list");
        }, 1000);
      } catch {
        toast.error("Failed to submit earning");
      }
    });
  };

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Add New Earning</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Your existing form fields remain the same */}
            <div className="space-y-2">
              <Label>Earning Platform</Label>
              <Controller
                name="earning_site_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      if (errors.earning_site_id) {
                        clearErrors("earning_site_id");
                      }
                    }}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.earning_site_id ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketplaces.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.earning_site_id && (
                <p className="text-sm text-red-500">
                  {errors.earning_site_id.message}
                </p>
              )}
            </div>

            {/* Payment + Job */}
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label>Payment Method</Label>
                <Controller
                  name="payment_method_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        if (errors.payment_method_id) {
                          clearErrors("payment_method_id");
                        }
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.payment_method_id ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select payment" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.payment_method_id && (
                  <p className="text-sm text-red-500">
                    {errors.payment_method_id.message}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label>Job Title</Label>
                <Controller
                  name="career_category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        if (errors.career_category_id) {
                          clearErrors("career_category_id");
                        }
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.career_category_id ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTitles.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.career_category_id && (
                  <p className="text-sm text-red-500">
                    {errors.career_category_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amounts */}
            <div className="flex gap-2">
              <div className="w-full space-y-2">
                <Label>Total Earning (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-white bg-secondary rounded-l-lg" />
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-12"
                    {...register("amount_usd", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                {errors.amount_usd && (
                  <p className="text-sm text-red-500">
                    {errors.amount_usd.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label>Total Earning (BDT)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-white bg-secondary rounded-l-lg" />
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-12"
                    {...register("amount_bdt")}
                  />
                </div>
                {errors.amount_bdt && (
                  <p className="text-sm text-red-500">
                    {errors.amount_bdt.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Earned At</Label>
              <Input type="date" {...register("earned_at")} />
              {errors.earned_at && (
                <p className="text-sm text-red-500">
                  {errors.earned_at.message}
                </p>
              )}
            </div>

            {/* Images Upload with Preview */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (MAX. 10MB each)
                      </p>
                    </div>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      {...register("earning_images")}
                    />
                  </label>
                </div>
                {errors.earning_images && (
                  <p className="text-sm text-red-500">
                    {errors.earning_images.message}
                  </p>
                )}
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Selected Images ({previewUrls.length})
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-lg overflow-hidden"
                      >
                        <Image
                          width={128}
                          height={128}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-scale-down"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button asChild
                type="submit"
                disabled={isPending}
                className="min-w-32"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    Submitting...
                  </span>
                ): (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEarningForm;
