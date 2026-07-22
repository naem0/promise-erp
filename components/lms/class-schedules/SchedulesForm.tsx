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
import { useEffect } from "react";
import { createClassSchedule, updateClassSchedule, ClassSchedule } from "@/apiServices/classSchedulesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SchedulesFormProps {
    title: string;
    schedule?: ClassSchedule;
}

interface FormValues {
    title: string;
    start_time: string;
    end_time: string;
    status: string;
}

function convertTo24Hour(timeStr: string): string {
    if (!timeStr) return "";
    // If it's already HH:mm:ss or HH:mm, return HH:mm
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        return timeStr.slice(0, 5);
    }
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return timeStr;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) {
        hours += 12;
    } else if (ampm === "AM" && hours === 12) {
        hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export default function SchedulesForm({
    title: formTitle,
    schedule,
}: SchedulesFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            start_time: "",
            end_time: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (schedule) {
            reset({
                title: schedule.title || "",
                start_time: convertTo24Hour(schedule.start_time),
                end_time: convertTo24Hour(schedule.end_time),
                status: schedule.status?.toString() || "1",
            });
        }
    }, [schedule, reset]);

    const submitHandler = async (values: FormValues) => {
        // Format times to HH:mm:ss format
        const formattedStartTime = values.start_time.length === 5 ? `${values.start_time}:00` : values.start_time;
        const formattedEndTime = values.end_time.length === 5 ? `${values.end_time}:00` : values.end_time;

        const payload = {
            title: values.title,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            status: Number(values.status),
        };

        try {
            const res = schedule
                ? await updateClassSchedule(Number(schedule.id), payload)
                : await createClassSchedule(payload);
                
            if (res?.success) {
                reset();
                toast.success(res.message || "Class schedule saved successfully!");
                router.push("/lms/class-schedules");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save class schedule");
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
                    toast.error(res.message || "Failed to save class schedule");
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
                    size="sm" 
                    onClick={() => router.back()} 
                    className="cursor-pointer"
                >
                    Go Back
                </Button>
                {formTitle}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Title<span className="text-red-500">*</span></label>
                        <Input 
                            placeholder="Enter class schedule title" 
                            {...register("title")} 
                        />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time<span className="text-red-500">*</span></label>
                        <Input 
                            type="time"
                            {...register("start_time")} 
                        />
                        {errors.start_time && <p className="text-sm text-red-500 mt-1">{errors.start_time.message}</p>}
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time<span className="text-red-500">*</span></label>
                        <Input 
                            type="time"
                            {...register("end_time")} 
                        />
                        {errors.end_time && <p className="text-sm text-red-500 mt-1">{errors.end_time.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : schedule ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
