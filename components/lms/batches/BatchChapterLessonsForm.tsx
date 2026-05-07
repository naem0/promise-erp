"use client";

import { useForm, useFieldArray, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    getChaptersByBatchId,
    bulkUpdateBatchChapterLessons,
    BatchChapterLessonFormValues,
    BatchChapter,
    BatchLesson,
} from "@/apiServices/batchService";
import { toast } from "sonner";
import ChapterSection from "@/components/lms/courses/ChapterSection";
import { FormValues } from "@/apiServices/courseService";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface BatchChapterLessonsFormProps {
    batchId: number;
    courseId: number;
    batchName?: string;
}

export default function BatchChapterLessonsForm({
    batchId,
    courseId,
    batchName,
}: BatchChapterLessonsFormProps) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // We reuse FormValues shape from courseService but swap course_id -> we just won't submit it.
    // Internally we manage batch_id separately.
    const {
        control,
        register,
        handleSubmit,
        setError,
        reset,
        formState: { isSubmitting, errors },
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
                            status: 1,
                            description: "",
                            schedule_at: null,
                            order: 1,
                        },
                    ],
                },
            ],
        },
    });

    const {
        fields: chapters,
        append: addChapter,
        remove: removeChapter,
        replace: replaceChapters,
    } = useFieldArray({
        control,
        name: "chapters",
    });

    // Sanitize API response chapters for the form
    const sanitizeChaptersForForm = (rawChapters: BatchChapter[]) => {
        return rawChapters.map((ch: BatchChapter) => ({
            id: ch.id,
            title: ch.title || "",
            description: ch.description || "",
            status: Number(ch.status ?? 1),
            lessons: (ch.lessons || []).map((l: BatchLesson) => ({
                id: l.id,
                title: l.title || "",
                description: l.description || "",
                duration: l.duration || 0,
                video_url: l.video_url || "",
                status: Number(l.status ?? 1),
                type: String(l.type ?? "1"),
                is_preview: Number(l.is_preview ?? 0),
                schedule_at: l.schedule_at
                    ? l.schedule_at.replace(" ", "T").substring(0, 16)
                    : null,
                order: l.order || 0,
            })),
        }));
    };

    // Fetch existing chapters for this batch
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await getChaptersByBatchId(batchId);
                if (res.success && res.data && res.data.length > 0) {
                    const sanitized = sanitizeChaptersForForm(res.data);
                    replaceChapters(sanitized);
                }
                // If no chapters yet, the default blank chapter stays
            } catch (error: unknown) {
                console.error("Error fetching batch chapters:", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to load batch chapters.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [batchId]);

    const onSubmit = async (data: FormValues) => {
        try {
            const payload: BatchChapterLessonFormValues = {
                batch_id: batchId,
                course_id: courseId,
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
                        schedule_at:
                            l.schedule_at && l.schedule_at !== ""
                                ? l.schedule_at.replace("T", " ")
                                : null,
                        order: lIndex + 1,
                    })),
                })),
            };

            const res = await bulkUpdateBatchChapterLessons(payload);
            console.log(res);

            if (res.success) {
                toast.success(res.message || "Batch chapters updated successfully.");
                router.push("/lms/batches");
            } else {
                if (res.errors) {
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        const fieldPath = field as Path<FormValues>;
                        setError(fieldPath, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                    toast.error("Please fix the validation errors.");
                } else {
                    toast.error(res.message || "Failed to save batch chapters.");
                }
            }
        } catch (error: unknown) {
            console.error("Error saving batch chapters:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred while saving.");
            }
        }
    };

    if (loading) {
        return (
            <Card className="w-full mx-auto">
                <CardContent className="pt-6">
                    <div className="flex flex-col justify-center items-center h-48 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">
                            Loading batch chapters...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">
                            Batch Chapters &amp; Lessons
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                        {batchName && (
                            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
                                {batchName}
                            </span>
                        )}
                        <div className="bg-primary/10 text-primary px-4 py-2 text-sm font-semibold rounded-md">
                            {chapters.length}{" "}
                            {chapters.length === 1 ? "Chapter" : "Chapters"}
                        </div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Update chapter and lesson content specific to this batch.
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Hidden field – not sent to API but satisfies FormValues type */}
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
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() =>
                                addChapter({
                                    title: "",
                                    description: "",
                                    status: 1,
                                    lessons: [
                                        {
                                            title: "",
                                            description: "",
                                            duration: 0,
                                            type: "1",
                                            video_url: "",
                                            is_preview: 0,
                                            status: 1,
                                            order: 1,
                                            schedule_at: null,
                                        },
                                    ],
                                })
                            }
                        >
                            + Add Another Chapter
                        </Button>

                        <Button
                            variant="default"
                            size="lg"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto cursor-pointer"
                        >
                            {isSubmitting ? "Saving..." : "Update Batch Curriculum"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
