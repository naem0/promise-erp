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
import { useState } from "react";
import {
    createJobApply,
    updateJobApply,
    JobApply,
    JobApplyCareer,
} from "@/apiServices/jobAppliesService";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JobAppliesFormProps {
    title: string;
    jobApply?: JobApply;
    careers?: JobApplyCareer[];
}

interface FormValues {
    career_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    cover_letter: string;
    status: string;
    resume?: FileList;
}

export default function JobAppliesForm({
    title,
    jobApply,
    careers = [],
}: JobAppliesFormProps) {
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            career_id: jobApply?.career?.id?.toString() || "",
            name: jobApply?.name || "",
            email: jobApply?.email || "",
            phone: jobApply?.phone || "",
            address: jobApply?.address || "",
            cover_letter: jobApply?.cover_letter || "",
            status: jobApply?.status?.toString() || "0",
            resume: undefined,
        },
    });

    const resumeFile = watch("resume");

    const handleResumeChange = () => {
        if (resumeFile && resumeFile.length > 0) {
            setResumeFileName(resumeFile[0].name);
        }
    };

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key !== "resume" && value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        if (values.resume && values.resume.length > 0) {
            formData.append("resume", values.resume[0]);
        }

        try {
            const res = jobApply
                ? await updateJobApply(Number(jobApply.id), formData)
                : await createJobApply(formData);

            if (res.success) {
                reset();
                setResumeFileName(null);
                toast.success(res.message || "Job application saved successfully!");
                router.push("/web-content/job-applies");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save job application");
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
                    toast.error(res.message || "Failed to save job application");
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
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                    <span className="text-xl">{"<"}</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Career / Job Position */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Job Position<span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="career_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Job Position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {careers.map((career) => (
                                            <SelectItem key={career.id} value={career.id.toString()}>
                                                {career.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.career_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.career_id.message}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Full Name<span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter full name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email Address<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Phone Number<span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter phone number" {...register("phone")} />
                        {errors.phone && (
                            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Pending</SelectItem>
                                        <SelectItem value="1">Reviewed</SelectItem>
                                        <SelectItem value="2">Shortlisted</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Input placeholder="Enter address" {...register("address")} />
                        {errors.address && (
                            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Resume Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Resume {!jobApply && <span className="text-red-500">*</span>}
                        </label>
                        {jobApply?.resume && (
                            <div className="mb-2 flex items-center gap-2">
                                <a
                                    href={jobApply.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View current resume
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="resume-upload"
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted transition text-sm font-medium"
                            >
                                <Upload className="h-4 w-4" />
                                {resumeFileName ? "Change File" : "Choose File"}
                            </label>
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                {...register("resume", {
                                    onChange: handleResumeChange,
                                })}
                            />
                            {resumeFileName && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="truncate max-w-[200px]">{resumeFileName}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResumeFileName(null);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Accepted formats: PDF, DOC, DOCX
                        </p>
                        {errors.resume && (
                            <p className="text-sm text-red-500 mt-1">{errors.resume.message}</p>
                        )}
                    </div>

                    {/* Cover Letter */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Cover Letter</label>
                        <Textarea
                            placeholder="Enter cover letter..."
                            {...register("cover_letter")}
                            rows={5}
                        />
                        {errors.cover_letter && (
                            <p className="text-sm text-red-500 mt-1">{errors.cover_letter.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-lg border-green-600 text-green-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg"
                    >
                        {isSubmitting ? "Submitting..." : jobApply ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
