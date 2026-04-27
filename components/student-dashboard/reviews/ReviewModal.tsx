"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Star, X } from "lucide-react";
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
import { CourseShortList, CreateReviewPayload, createNewStudentReview, getStudentCourseShortLists } from "@/apiServices/studentDashboardService";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: {
    courseId: string;
    rating: number;
    feedback: string;
  };
}

type FormData = {
  courseId: string;
  rating: number;
  feedback: string;
};

export default function ReviewModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: ReviewModalProps) {
  const { data: session, status } = useSession()
  const token = session?.accessToken;
  // start course list fetch
  const [courses, setCourses] = useState<CourseShortList[]>([]);
  const [courseLoading, setCourseLoading] = useState(false)


  useEffect(() => {
    const fetchCourses = async () => {
      if (status !== "authenticated" || !token) return;
      setCourseLoading(true)
      try {
        const courseLists = await getStudentCourseShortLists(token);
        if (courseLists?.success) {
          setCourses(courseLists?.data?.courses);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error(error)
        }
      } finally {
        setCourseLoading(false)
      }
    }
    fetchCourses();
  }, [token])

  // end course list fetch

  // create student review with react hook form 
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      courseId: "",
      rating: 0,
      feedback: "",
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
        feedback: "",
      });
    }
  }, [open, initialData, reset]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    // Find the selected course to get its batch_id
    const selectedCourse = courses.find(
      (c) => String(c.course_id) === data.courseId
    );

    if (!selectedCourse) {
      setError("courseId", { message: "Selected course not found" });
      return;
    }

    const payload: CreateReviewPayload = {
      batch_id: selectedCourse.batch_id,
      rating: data.rating,
      feedback: data.feedback,
      status: 0,
      is_featured: 0,
    };

    setSubmitting(true);
    try {
      const response = await createNewStudentReview(payload, token);

      if (response?.success) {
        toast.success(response?.message || "Student Review created successfully");
        onOpenChange(false);
        reset();
      } else {
        // Surface server-side field errors — show toast for every error message
        if (response?.errors) {
          const errorMessages = Object.values(response.errors).flat();
          errorMessages.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error(response?.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("createNewStudentReview Error:", error.message);
      }
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                    {
                      courseLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="animate-spin" size={24} />
                        </div>
                      ) : courses?.length === 0 ? (
                        <div className="flex items-center justify-center py-2">
                          <p className="text-sm text-slate-500">No courses found</p>
                        </div>
                      ) : (
                        courses?.map((course) => (
                          <SelectItem key={course?.course_id} value={String(course?.course_id)}>
                            {course?.course_name}
                          </SelectItem>
                        ))
                      )
                    }

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
                    className={`${star <= rating
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
              name="feedback"
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
            {errors.feedback && (
              <p className="text-xs text-red-500 font-medium ml-1">{errors.feedback.message}</p>
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
              disabled={submitting}
              className="cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  {mode === "add" ? "Adding..." : "Updating..."}
                </span>
              ) : (
                mode === "add" ? "Create Review" : "Update Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
