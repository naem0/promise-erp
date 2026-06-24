"use client";

import { useForm, useFieldArray, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createChaptersWithLessons,
  updateChaptersWithLessons,
  getChaptersByCourseId,
  FormValues,
  Chapter,
  Lesson
} from "@/apiServices/courseService";
import { toast } from "sonner";
import ChapterSection from "./ChapterSection";
import { useEffect, useState } from "react";

interface ChapterLessonAddFormProps {
  courseId: number;
  onSuccess: () => void;
  isEdit?: boolean;
}

export default function ChapterLessonAddForm({
  courseId,
  onSuccess,
  isEdit = false
}: ChapterLessonAddFormProps) {
  const [loading, setLoading] = useState(isEdit);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<FormValues>({
    defaultValues: {
      course_id: courseId,
      chapters: [
        {
          title: "",
          description: "",
          status: 1,
          lessons: [
            {
              title: "",
              duration: 0,
              type: "1",
              video_url: "",
              is_preview: 0,
              status: 1
            }
          ]
        }
      ]
    }
  });

  const {
    fields: chapters,
    append: addChapter,
    remove: removeChapter,
    replace: replaceChapters
  } = useFieldArray({
    control,
    name: "chapters"
  });

  // Helper function to sanitize API response data for form
  const sanitizeChaptersForForm = (chapters: Chapter[]) => {
    return chapters.map((ch: Chapter) => ({
      id: ch.id,
      title: ch.title || "",
      description: ch.description || "",
      status: Number(ch.status ?? 1),
      lessons: (ch.lessons || []).map((l: Lesson) => ({
        id: l.id,
        title: l.title || "",
        description: l.description || "",
        duration: l.duration || 0,
        video_url: l.video_url || "",
        status: Number(l.status ?? 1),
        type: String(l.type ?? "1"),
        is_preview: Number(l.is_preview ?? 0),
        schedule_at: l.schedule_at ? l.schedule_at.replace(" ", "T").substring(0, 16) : null,
        order: l.order || 0
      }))
    }));
  };

  // Fetch existing chapters in edit mode
  useEffect(() => {
    if (isEdit && courseId) {
      const fetchChapters = async () => {
        try {
          const res = await getChaptersByCourseId(courseId);

          if (res?.success && res?.data) {
            const existingChapters: Chapter[] = res?.data;
            const sanitizedChapters = sanitizeChaptersForForm(existingChapters);

            if (sanitizedChapters.length > 0) {
              replaceChapters(sanitizedChapters);
            }
          } else {
            toast.error(res?.message || "Failed to load existing chapters");
          }
        } catch (error: unknown) {
          console.error("Error fetching chapters:", error);
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred while loading chapters");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchChapters();
    }
  }, [isEdit, courseId, replaceChapters]);

  const onSubmit = async (data: FormValues) => {
    try {
      const transformedData: FormValues = {
        course_id: Number(data.course_id),
        chapters: data.chapters.map((ch) => ({
          id: ch.id ? Number(ch.id) : undefined,
          title: ch.title || "",
          description: ch.description || "",
          status: Number(ch.status),
          lessons: ch.lessons.map((l, lIndex) => ({
            id: l.id ? Number(l.id) : undefined,
            title: l.title || "",
            description: l.description || null,
            duration: Number(l.duration),
            type: Number(l.type),
            status: Number(l.status),
            is_preview: Number(l.is_preview) || 0,
            video_url: l.video_url || "",
            schedule_at: l.schedule_at && l.schedule_at !== "" ? l.schedule_at.replace("T", " ") : null,
            order: lIndex + 1,
          }))
        }))
      };

      const apiCall = isEdit ? updateChaptersWithLessons : createChaptersWithLessons;
      const res = await apiCall(transformedData);

      if (res?.success) {
        toast.success(res?.message || (isEdit ? "Chapters updated successfully!" : "Chapters created successfully!"));
        
        // Update form with response data to ensure IDs are synced
        if (res?.data && res?.data?.length > 0) {
          const sanitizedChapters = sanitizeChaptersForForm(res?.data);
          replaceChapters(sanitizedChapters);
        }
        
        onSuccess();
      } else {
        // Handle validation errors from backend
        if (res?.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            // Use Path<FormValues> for proper type safety with nested paths
            const fieldPath = field as Path<FormValues>;
            setError(fieldPath, {
              type: "server",
              message: errorMessage as string
            });
          });
          toast.error("Please fix the validation errors.");
        } else {
          toast.error(res.message || "Failed to save chapters");
        }
      }
    } catch (error: unknown) {
      console.error("Error saving chapters:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred while saving chapters and lessons");
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-48 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading course chapters...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">
            {isEdit ? "Edit Chapters & Lessons" : "Add Chapters & Lessons"}
          </CardTitle>
          <div className="bg-primary/10 text-primary px-4 py-2 text-sm font-semibold rounded-md">
            {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <input
            type="hidden"
            {...register("course_id", { valueAsNumber: true })}
          />

          <div className="space-y-6">
            {chapters.map((ch, chIndex) => (
              <ChapterSection
                key={ch.id}
                chIndex={chIndex}
                control={control}
                register={register}
                errors={errors}
                chapters={chapters}
                removeChapter={removeChapter}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <Button
              type="button"
              size="sm"
              onClick={() => addChapter({
                title: "",
                description: "",
                status: 1,
                lessons: [{
                  title: "",
                  description: "",
                  duration: 0,
                  type: "1",
                  video_url: "",
                  is_preview: 0,
                  status: 1,
                  order: 1,
                  schedule_at: null
                }]
              })}
            >
              + Add Another Chapter
            </Button>

            <Button
              variant="default"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update Curriculum" : "Save & Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

