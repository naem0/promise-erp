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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    createChapter,
    updateChapter,
    Chapter,
    SingleChapterResponse,
} from "@/apiServices/chaptersService";

/**  
 * No interfaces here — clean and safe  
 */
type FormValues = {
    title: string;
    description: string;
    batch_id: string;
    course_id: string;
    branch_id: string;
    status: string;
};

export default function ChapterForm({
    title,
    chapter,
    branches = [],
    batches = [],
    courses = [],
}: {
    title: string;
    chapter?: Chapter;
    branches: { id: number; name: string }[];
    batches: { id: number; name: string }[];
    courses: { id: number; title: string }[];
}) {
    const router = useRouter();

    const {
        register,
        control,
        setError,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            title: chapter?.title || "",
            description: chapter?.description || "",
            batch_id: chapter?.batch_id?.toString() || "",
            course_id: chapter?.course_id?.toString() || "",
            branch_id: chapter?.branch_id?.toString() || "",
            status: chapter?.status?.toString() || "1",
        },
    });

    // Reset on edit
    useEffect(() => {
        if (!chapter) return;

        reset({
            title: chapter.title,
            description: chapter.description || "",
            batch_id: chapter.batch_id?.toString() || "",
            course_id: chapter.course_id?.toString() || "",
            branch_id: chapter.branch_id?.toString() || "",
            status: chapter.status?.toString() || "1",
        });
    }, [chapter, reset]);

    const setFormError = (field: string, message: string) => {
        setError(field as keyof FormValues, { type: "server", message });
    };

    const submitHandler = async (values: FormValues) => {
        const payload = {
            title: values.title,
            description: values.description,
            batch_id: Number(values.batch_id),
            course_id: Number(values.course_id),
            branch_id: Number(values.branch_id),
            status: Number(values.status),
        };

        let res: SingleChapterResponse;

        try {
            if (chapter) {
                res = await updateChapter(chapter.id, payload);
            } else {
                res = await createChapter(payload);
            }

            if (res.success) {
                toast.success(res.message);
                router.push("/lms/chapters");
            } else if (res.errors) {
                Object.entries(res.errors).forEach(([field, messages]) => {
                    if (messages.length > 0) {
                        setFormError(field, messages[0]);
                    }
                });
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Chapter Title</label>
                    <Input
                        placeholder="Enter chapter title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                        placeholder="Enter chapter description"
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                        <p className="text-red-500">{errors.description.message}</p>
                    )}
                </div>

                {/* Batch */}
                <Controller
                    name="batch_id"
                    control={control}
                    rules={{ required: "Batch is required" }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Batch</label>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {batches.map((b) => (
                                        <SelectItem key={b.id} value={b.id.toString()}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.batch_id && (
                                <p className="text-red-500">{errors.batch_id.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    rules={{ required: "Course is required" }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Course</label>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_id && (
                                <p className="text-red-500">{errors.course_id.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Branch</label>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((br) => (
                                        <SelectItem key={br.id} value={br.id.toString()}>
                                            {br.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.branch_id && (
                                <p className="text-red-500">{errors.branch_id.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="0">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-red-500">{errors.status.message}</p>
                            )}
                        </div>
                    )}
                />

                <Button disabled={isSubmitting} className="w-full" type="submit">
                    {isSubmitting ? "Submitting..." : chapter ? "Update Chapter" : "Add Chapter"}
                </Button>
            </form>
        </div>
    );
}
