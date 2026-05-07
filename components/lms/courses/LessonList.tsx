"use client";

import { useFieldArray, Control, UseFormRegister, FieldErrors, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/apiServices/courseService";
import { Plus, Video, FileText, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface LessonListProps {
  chapterIndex: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export default function LessonList({ chapterIndex, control, register, errors }: LessonListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `chapters.${chapterIndex}.lessons` as const
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-lg flex items-center gap-2">
          <Video className="w-5 h-5" />
          Lessons
        </h5>
        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
          {fields.length} {fields.length === 1 ? 'Lesson' : 'Lessons'}
        </span>
      </div>

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <div key={f.id} className="border rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="font-semibold text-lg">Lesson Setup</div>
              </div>
              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    remove(idx);
                    toast.success("Lesson removed successfully");
                  }}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="hidden" {...register(`chapters.${chapterIndex}.lessons.${idx}.id` as const)} />
              <input type="hidden" {...register(`chapters.${chapterIndex}.lessons.${idx}.order` as const)} />

              <div className="md:col-span-2 grid gap-2">
                <Label htmlFor={`lesson-title-${chapterIndex}-${idx}`}>
                  Lesson Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`lesson-title-${chapterIndex}-${idx}`}
                  placeholder="e.g. Setting up the Project"
                  {...register(`chapters.${chapterIndex}.lessons.${idx}.title` as const,)}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.title && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.title?.message}</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 grid gap-2">
                <Label htmlFor={`lesson-description-${chapterIndex}-${idx}`}>Lesson Description</Label>
                <Textarea
                  id={`lesson-description-${chapterIndex}-${idx}`}
                  placeholder="What will students learn in this lesson?..."
                  {...register(`chapters.${chapterIndex}.lessons.${idx}.description` as const)}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.description && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.description?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-duration-${chapterIndex}-${idx}`}>Duration (mins)</Label>
                <Input
                  id={`lesson-duration-${chapterIndex}-${idx}`}
                  type="number"
                  placeholder="30"
                  {...register(`chapters.${chapterIndex}.lessons.${idx}.duration` as const, {
                    valueAsNumber: true
                  })}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.duration && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.duration?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-type-${chapterIndex}-${idx}`}>Content Type</Label>
                <Controller
                  name={`chapters.${chapterIndex}.lessons.${idx}.type` as const}
                  control={control}
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={field.onChange} disabled>
                      <SelectTrigger id={`lesson-type-${chapterIndex}-${idx}`} className="w-full h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" defaultChecked>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-blue-500" />
                            Prerecorded Video
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            Article / Doc
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-orange-500" />
                            Quiz / Test
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.type && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.type?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-video-url-${chapterIndex}-${idx}`}>Video / Resource URL</Label>
                <Input
                  id={`lesson-video-url-${chapterIndex}-${idx}`}
                  placeholder="Enter your video URL here"
                  {...register(`chapters.${chapterIndex}.lessons.${idx}.video_url` as const)}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.video_url && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.video_url?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-schedule-${chapterIndex}-${idx}`}>Available From (Optional)</Label>
                <Input
                  id={`lesson-schedule-${chapterIndex}-${idx}`}
                  type="datetime-local"
                  {...register(`chapters.${chapterIndex}.lessons.${idx}.schedule_at` as const)}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.schedule_at && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.schedule_at?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-preview-${chapterIndex}-${idx}`}>Access Level</Label>
                <Controller
                  name={`chapters.${chapterIndex}.lessons.${idx}.is_preview` as const}
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id={`lesson-preview-${chapterIndex}-${idx}`} className="w-full h-10">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Free Preview</SelectItem>
                        <SelectItem value="0">Premium Only</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.is_preview && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.is_preview?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`lesson-status-${chapterIndex}-${idx}`}>Status</Label>
                <Controller
                  name={`chapters.${chapterIndex}.lessons.${idx}.status` as const}
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id={`lesson-status-${chapterIndex}-${idx}`} className="w-full h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="min-h-5">
                  {errors?.chapters?.[chapterIndex]?.lessons?.[idx]?.status && (
                    <p className="text-red-500 text-sm">{errors.chapters[chapterIndex]?.lessons?.[idx]?.status?.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button
          className="cursor-pointer"
          type="button"
          size="sm"
          onClick={() => append({
            title: "",
            description: "",
            duration: 0,
            type: "1",
            video_url: "",
            is_preview: 0,
            status: 1,
            order: fields.length + 1,
            schedule_at: null
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>
    </div>
  );
}

