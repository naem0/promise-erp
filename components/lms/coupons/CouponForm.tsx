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
import { CouponItem, CreateCouponRequest } from "@/apiServices/couponsService";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CouponFormProps {
  title: string;
  courses: { id: number; title: string }[];
  onSubmit: (
    data: CreateCouponRequest,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => void | Promise<void>;
  coupon?: CouponItem;
}

export default function CouponForm({
  title,
  courses,
  onSubmit,
  coupon,
}: CouponFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCouponRequest>({
    defaultValues: {
      title: coupon?.title || "",
      coupon_code: coupon?.coupon_code || "",
      discount_percentage: coupon?.discount_percentage || 0,
      coupon_expire_time: coupon?.coupon_expire_time?.split(" ")[0] || "",
      status: coupon?.status ?? 1,
      usage_limit: coupon?.usage_limit || 1,
      course_id: coupon?.courses?.map((c) => c.id) || [],
    },
  });

  const setFormError = (field: string, message: string | { type: string; message: string }) => {
    const errorMessage = typeof message === 'string' ? message : message.message || '';
    setError(field as keyof CreateCouponRequest, { type: "server", message: errorMessage });
  };


  const submitHandler = async (values: CreateCouponRequest) => {
    await onSubmit(values, setFormError, () => reset());
  };

  return (
    <div className=" mx-auto bg-card border rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-start mb-8">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="cursor-pointer me-2"
        >
          <span className="text-md mr-2">Go Back</span>
        </Button>
        <h2 className="text-2xl font-bold">{title}</h2>

      </div>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Coupon Title</Label>
            <Input
              id="title"
              placeholder="e.g. Summer Special Sale"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Coupon Code */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="coupon_code">Coupon Code</Label>
            <Input
              id="coupon_code"
              placeholder="e.g. SUMMER2025"
              {...register("coupon_code")}
            />
            {errors.coupon_code && (
              <p className="text-sm text-red-500 mt-1">{errors.coupon_code.message}</p>
            )}
          </div>

          {/* Discount Percentage */}
          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Discount (%)</Label>
            <Input
              id="discount_percentage"
              type="number"
              placeholder="20"
              {...register("discount_percentage", {
                valueAsNumber: true,
                min: { value: 0, message: "Min 0%" },
                max: { value: 100, message: "Max 100%" },
              })}
            />
            {errors.discount_percentage && (
              <p className="text-sm text-red-500 mt-1">
                {errors.discount_percentage.message}
              </p>
            )}
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              placeholder="100"
              {...register("usage_limit", {
                valueAsNumber: true,
                min: { value: 1, message: "Min 1" },
              })}
            />
            {errors.usage_limit && (
              <p className="text-sm text-red-500 mt-1">
                {errors.usage_limit.message}
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="coupon_expire_time">Expires At</Label>
            <Input
              id="coupon_expire_time"
              type="date"
              {...register("coupon_expire_time")}
            />
            {errors.coupon_expire_time && (
              <p className="text-sm text-red-500 mt-1">
                {errors.coupon_expire_time.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger id="status" className="w-full">
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

          {/* Courses Multi-select */}
          <div className="md:col-span-2 space-y-2">
            <Label>Select Courses</Label>
            <Controller
              name="course_id"
              control={control}
              render={({ field }) => (
                <div className="border border-muted rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto bg-muted/20">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border"
                      onClick={() => {
                        const values = field.value || [];
                        const newValues = values.includes(course.id)
                          ? values.filter((id) => id !== course.id)
                          : [...values, course.id];
                        field.onChange(newValues);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(course.id)}
                        onChange={() => { }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label className="text-sm font-medium leading-none cursor-pointer">
                        {course.title}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.course_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.course_id.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Processing...
              </span>
            ) : coupon ? (
              "Update Coupon"
            ) : (
              "Create Coupon"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}