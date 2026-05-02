"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    createReview,
    updateReview,
    Review,
} from "@/apiServices/reviewService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Batch } from "@/apiServices/batchService";
import { Student } from "@/apiServices/studentService";

interface ReviewFormProps {
    title: string;
    review?: Review;
    batches?: Batch[];
    students?: Student[];
}

interface FormValues {
    user_id: string;
    batch_id: string;
    rating: string;
    feedback: string;
    status: string;
    is_featured: string;
}

export default function ReviewsForm({
    title,
    review,
    batches = [],
    students = []
}: ReviewFormProps) {
    const router = useRouter();
    const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            user_id: review?.user?.id?.toString() || "",
            batch_id: review?.batch?.id?.toString() || "",
            rating: review?.rating?.toString() || "",
            feedback: review?.feedback || "",
            status: review?.status?.toString() ?? "0",
            is_featured: review?.is_featured?.toString() ?? "0",
        },
    });

    const selectedUserId = watch("user_id");

    useEffect(() => {
        if (selectedUserId) {
            const student = students.find(s => s.id.toString() === selectedUserId);

            if (student && student.courses && student.courses.length > 0) {
                const enrolledEnrollmentPairs = student.courses.map(c => ({
                    courseTitle: c.title,
                    batchName: c.batch
                }));


                const filtered = batches.filter(batch =>
                    enrolledEnrollmentPairs.some(pair =>
                        pair.batchName === batch.name &&
                        pair.courseTitle === batch.course?.title
                    )
                );

                setFilteredBatches(filtered);

                const currentBatchId = watch("batch_id");
                if (currentBatchId && !filtered.some(b => b.id.toString() === currentBatchId)) {
                    if (review?.user?.id?.toString() !== selectedUserId) {
                        setValue("batch_id", "");
                    }
                }
            } else {
                setFilteredBatches([]);
                setValue("batch_id", "");
            }
        } else {
            setFilteredBatches([]);
            setValue("batch_id", "");
        }

    }, [selectedUserId, batches, students, setValue]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        try {
            const res = review
                ? await updateReview(Number(review.id), formData)
                : await createReview(formData);
            console.log(res);
            if (res.success) {
                reset();
                toast.success(res.message || "Review saved successfully!");
                router.push("/lms/reviews");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save review");
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        setError(field as keyof FormValues, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res.message || "Failed to save review");
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

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button
                    variant="secondary"
                    onClick={() => router.back()}
                    className="cursor-pointer"
                >
                    <span>Go Back</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                    {/* Student Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Student <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="user_id"
                            control={control}
                            rules={{ required: "Student is required" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map(student => (
                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                {student.name} ({student.phone})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.user_id && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.user_id.message}
                            </p>
                        )}
                    </div>

                    {/* Filtered Batch Selection - Matches EXACT Enrollment */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Batch <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="batch_id"
                            control={control}
                            rules={{ required: "Batch is required" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!selectedUserId || filteredBatches.length === 0}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={!selectedUserId ? "Select student first" : "Select Batch"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredBatches.map(batch => (
                                            <SelectItem key={batch.id} value={batch.id.toString()}>
                                                {batch.name} ({batch.course?.title || "Course"})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.batch_id && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.batch_id.message}
                            </p>
                        )}
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Rating <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="rating"
                            control={control}
                            rules={{ required: "Rating is required" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">⭐ (1)</SelectItem>
                                        <SelectItem value="2">⭐⭐ (2)</SelectItem>
                                        <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                                        <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rating && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.rating.message}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Is Featured */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Featured
                        </label>
                        <Controller
                            name="is_featured"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Featured" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Featured</SelectItem>
                                        <SelectItem value="0">Normal</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.is_featured && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.is_featured.message}
                            </p>
                        )}
                    </div>

                    {/* Feedback */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Feedback <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Enter review feedback"
                            {...register("feedback", { required: "Feedback is required" })}
                            rows={4}
                        />
                        {errors.feedback && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.feedback.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-lg border-green-600 text-green-600 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        {isSubmitting ? "Submitting..." : review ? "Update Review" : "Add Review"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
