"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: {
    courseId: string;
    rating: number;
    comment: string;
  };
}

type FormData = {
  courseId: string;
  rating: number;
  comment: string;
};

export default function ReviewModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: ReviewModalProps) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      courseId: "",
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    } else if (open) {
      reset({
        courseId: "",
        rating: 0,
        comment: "",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: FormData) => {
    console.log("Submit review:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {mode === "add" ? "Add Review" : "Edit Review"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-7">
          {/* Course Selection */}
          <div className="space-y-2.5">
            <Label className="text-[15px] font-bold text-slate-700">Select a course</Label>
            <Controller
              name="courseId"
              control={control}
              rules={{ required: "Please select a course" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-12 bg-white border-slate-200 focus:ring-emerald-500 rounded-lg text-slate-600">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-xl border-slate-100">
                    <SelectItem value="1">Professional Graphics Design</SelectItem>
                    <SelectItem value="2">Web Development Mastery</SelectItem>
                    <SelectItem value="3">Digital Marketing Essentials</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && (
              <p className="text-xs text-red-500 font-medium ml-1">{errors.courseId.message}</p>
            )}
          </div>

          {/* Star Rating */}
          <div className="space-y-3.5">
            <Label className="text-[15px] font-bold text-slate-700">Rate This Course</Label>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  className="transition-all hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={`${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-50 text-slate-200"
                    } cursor-pointer transition-colors`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-red-500 font-medium ml-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Review Textarea */}
          <div className="space-y-2.5">
            <Controller
              name="comment"
              control={control}
              rules={{ required: "Review text is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Write a Review"
                  className="min-h-[140px] bg-white border-slate-200 focus:ring-emerald-500 rounded-lg resize-none p-4 text-slate-600 placeholder:text-slate-400"
                />
              )}
            />
            {errors.comment && (
              <p className="text-xs text-red-500 font-medium ml-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="cursor-pointer"
            >
              {mode === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
