"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getCourseLearnings, createCourseLearningsFormData, editCourseLearnings, CourseLearning, CourseLearningResponseData } from "@/apiServices/courseService";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CourseLearningInput {
  id?: number;
  title: string;
  status: number;
}

export interface FormValues {
  course_id: number;
  course_learnings: CourseLearningInput[];
}

interface CourseLearningsAddFormProps {
  courseId: number;
  title?: string;
  onSuccess: () => void;
  isEdit?: boolean;
}

export default function CourseLearningsAddForm({
  courseId,
  title = "Course Learnings",
  onSuccess,
  isEdit = false,
}: CourseLearningsAddFormProps) {
  const [loading, setLoading] = useState(isEdit);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      course_id: courseId,
      course_learnings: [{ title: "", status: 1 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "course_learnings",
  });

  // Fetch existing learnings for edit
  useEffect(() => {
    if (isEdit && courseId) {
      const fetchLearnings = async () => {
        try {
          const res = await getCourseLearnings(courseId);
          const fetchedData = Array.isArray(res.data) ? res.data : (res.data?.course_learnings || []);

          if (fetchedData.length > 0) {
            const sanitizedLearnings = fetchedData.map((item: CourseLearningResponseData) => ({
              id: item.id,
              title: item.title || "",
              status: item.status ?? 1,
            }));
            replace(sanitizedLearnings);
          }
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : "Failed to load course learnings.");
        } finally {
          setLoading(false);
        }
      };
      fetchLearnings();
    }
  }, [isEdit, courseId, replace]);

  const onSubmit = async (data: FormValues) => {
    try {
      const apiCall = isEdit ? editCourseLearnings : createCourseLearningsFormData;
      const res = await apiCall(courseId, data.course_learnings);

      if (res.success) {
        toast.success(res.message || "Course learnings saved!");
        onSuccess();
      } else {
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setError(field as Path<FormValues>, { type: "server", message: errorMessage as string });
          });
        }
        toast.error(res.message || "Failed to save learnings");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save learnings");
    }
  };

  if (loading) {
    return (
      <Card className="w-full mx-auto shadow-lg border-gray-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Loading course learnings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto shadow-lg border-gray-100 overflow-hidden">
      <CardHeader className="bg-gray-50/50 pb-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">List what the students will learn from this course.</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 text-sm font-semibold">
            {fields.length} {fields.length === 1 ? 'Outcome' : 'Outcomes'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("course_id")} />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 bg-white "
              >
                <div className="flex-1 w-full grid gap-2">
                  <Label className="text-sm font-semibold text-gray-700 ml-1">Learning Outcome {index + 1}</Label>
                  <div className="flex items-center gap-2 w-full">
                    <input type="hidden" {...register(`course_learnings.${index}.id` as const)} />
                    <Input
                      placeholder="e.g. Master the basics of React and Hooks"
                      className="h-11 border-gray-200 flex-1"
                      {...register(`course_learnings.${index}.title`)}
                    />

                    <div className="w-32">
                      <Controller
                        control={control}
                        name={`course_learnings.${index}.status` as const}
                        render={({ field }) => (
                          <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(parseInt(val))}
                          >
                            <SelectTrigger className="h-11 border-gray-200 ">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent >
                              <SelectItem value="1">Active</SelectItem>
                              <SelectItem value="0">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 w-11"
                        onClick={() => {
                          remove(index);
                          toast.success("Learning outcome removed.");
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                  {errors.course_learnings?.[index]?.title && (
                    <p className="text-red-500 text-xs font-medium italic ml-1">
                      {errors.course_learnings[index]?.title?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-50">
            <Button
              type="button"
              size="sm"

              onClick={() => append({ title: "", status: 1 })}
            >
              <Plus /> Add Another Outcome
            </Button>

            <Button type="submit" disabled={isSubmitting} size="lg" >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <>
                  Save & Continue
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
