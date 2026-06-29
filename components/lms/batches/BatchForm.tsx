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
import { useEffect, useState } from "react";
import { Branch, getBranches } from "@/apiServices/branchService";
import { Course, getCourses } from "@/apiServices/courseService";
import { getTeachers } from "@/apiServices/teacherService";
import { addBatch, Batch, updateBatch } from "@/apiServices/batchService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/apiServices/teacherService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";


interface BatchFormProps {
    title: string;
    batch?: Batch;
}

interface FormValues {
    course_id: string;
    branch_ids: string[]; // multiple branch selection
    name: string;
    price: number | null;
    discount: number | null;
    discount_type: string;
    duration: string;
    start_date: string;
    end_date: string;
    apply_end_date: string;
    status: string;
    is_online: string;
    teacher_ids?: string[];
    whatsapp_group_link?: string; // optional WhatsApp group link
}

export default function BatchForm({ title, batch }: BatchFormProps) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [branchSearch, setBranchSearch] = useState("");
    const [branchSearching, setBranchSearching] = useState(false);
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
            name: batch?.name || "",
            course_id: batch?.course_id?.toString() || "",
            branch_ids: batch?.branch_id ? [batch.branch_id.toString()] : [], // initialize with existing branch if editing
            price: batch ? parseFloat(batch.price?.toString() || "") : 0,
            discount: batch ? parseFloat(batch.discount?.toString() || "") : 0,
            discount_type: batch?.discount_type || "percentage",
            duration: batch?.duration || "",
            start_date: batch?.start_date_raw || "",
            end_date: batch?.end_date_raw || "",
            apply_end_date: batch?.apply_end_date ? batch.apply_end_date.replace(" ", "T") : "",
            status: batch?.status?.toString() || "0",
            is_online: batch?.is_online?.toString() || "1",
            teacher_ids: batch?.instructors?.map((t) => t.id.toString()) ||
                batch?.teacher_ids?.map((id) => id.toString()) || [],
            whatsapp_group_link: batch?.whatsapp_group_link || "",
        },
    });

    const selectedBranchIds = watch("branch_ids"); // for multi-branch selection

    useEffect(() => {
        if (batch) {
            reset({
                name: batch.name,
                course_id: batch.course_id?.toString(),
                branch_ids: batch.branch_id ? [batch.branch_id.toString()] : [],
                price: parseFloat(batch.price?.toString() || ""),
                discount: parseFloat(batch.discount?.toString() || ""),
                discount_type: batch.discount_type || "percentage",
                duration: batch.duration || "",
                start_date: batch.start_date_raw || "",
                end_date: batch.end_date_raw || "",
                apply_end_date: batch.apply_end_date ? batch.apply_end_date.replace(" ", "T") : "",
                status: batch.status?.toString() || "0",
                is_online: batch.is_online?.toString() || "1",
                teacher_ids: batch.instructors?.map((t) => t.id.toString()) ||
                    batch.teacher_ids?.map((id) => id.toString()) || [],
                whatsapp_group_link: batch.whatsapp_group_link || "",
            });
        }
    }, [batch, reset]);

    useEffect(() => {
        async function fetchTeachers() {
            const firstBranchId = selectedBranchIds && selectedBranchIds.length > 0 ? selectedBranchIds[0] : null;
            if (!firstBranchId) {
                setTeachers([]);
                return;
            }
            try {
                const response = await getTeachers({ branch_id: firstBranchId, per_page: 100, });
                if (response.success) {
                    setTeachers(response.data?.teachers || []);
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        }
        fetchTeachers();
    }, [selectedBranchIds]);

    useEffect(() => {
        async function loadInitialData() {
            try {
                setIsLoading(true);
                await getCourses({ per_page: 999 });
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadInitialData();
    }, []);

    // 3s debounce-সহ branch search এবং clear করার জন্য একক useEffect
    useEffect(() => {
        let active = true;
        const delay = branchSearch === "" ? 0 : 3000;

        const timer = setTimeout(async () => {
            try {
                setBranchSearching(true);
                const res = await getBranches(
                    branchSearch ? { search: branchSearch, per_page: 999 } : { per_page: 999 }
                );
                if (active && res.success) {
                    setBranches(res.data?.branches || []);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            } finally {
                if (active) {
                    setBranchSearching(false);
                }
            }
        }, delay);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [branchSearch]);

    const submitHandler = async (values: FormValues) => {
        const baseData = {
            ...values,
            course_id: Number(values.course_id),
            branch_id: Number(values.branch_ids[0]),
            price: Number(values.price),
            discount: Number(values.discount),
            is_online: Number(values.is_online),
            status: Number(values.status),
            apply_end_date: values.apply_end_date ? values.apply_end_date.replace("T", " ") : "",
            teacher_ids: values.teacher_ids ? values.teacher_ids.map(id => Number(id)) : [],
            whatsapp_group_link: values.whatsapp_group_link,
        };

        try {

            const res = batch ? await updateBatch(batch.id, baseData) : await addBatch(baseData);

            if (res.success) {
                reset();
                toast.success(res.message);
                router.push("/lms/batches");
            } else {
                if (res.errors) {
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        if (messages && (Array.isArray(messages) ? messages.length > 0 : !!messages)) {
                            const message = Array.isArray(messages) ? messages[0] : messages;
                            setError(field as keyof FormValues, { type: "server", message: message as string });
                        }
                    });
                } else {
                    toast.error(res.message || "Something went wrong. Please try again.");
                }
            }
            return;
        } catch (error) {
            console.error("Error submitting batch:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred while submitting batch");
            }
        }
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">
                    <Button
                        variant="secondary"
                        onClick={() => router.back()}
                        className="cursor-pointer me-3"
                    >
                        <span className="text-sm">Go Back</span>
                    </Button>
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(submitHandler)} className="grid gap-2">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="course_id">Course<span className="text-red-500">*</span></Label>
                            <Controller
                                name="course_id"
                                control={control}
                                render={({ field }) => (
                                    <CourseSearchSelect
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        placeholder="Select Course"
                                        defaultValue={batch?.course_id?.toString()}
                                    />
                                )}
                            />
                            {errors.course_id && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.course_id.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Only show branch selection when creating a new batch, not when editing */}
                    {!batch && (
                        <div className="grid gap-2 relative pb-5">
                            <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="branch_ids">Branches<span className="text-red-500">*</span></Label>
                                <div className="relative flex items-center w-56">
                                    <input
                                        type="text"
                                        value={branchSearch}
                                        onChange={(e) => setBranchSearch(e.target.value)}
                                        placeholder="Search branches..."
                                        className="w-full border rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    {branchSearching && (
                                        <span className="absolute right-2 text-xs text-muted-foreground animate-pulse">...</span>
                                    )}
                                    {branchSearch && !branchSearching && (
                                        <button
                                            type="button"
                                            onClick={() => setBranchSearch("")}
                                            className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
                                            title="Clear search"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Controller
                                name="branch_ids"
                                control={control}
                                render={({ field }) => (
                                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/20">
                                        <div className="flex items-center space-x-2 p-2 mb-2 rounded-md border-b pb-3 bg-accent/10">
                                            <input
                                                type="checkbox"
                                                id="branch-select-all"
                                                checked={branches.length > 0 && (field.value?.length || 0) === branches.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        field.onChange(branches?.map((b) => b.id.toString()));
                                                    } else {
                                                        field.onChange([]);
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <Label htmlFor="branch-select-all" className="text-sm font-semibold leading-none cursor-pointer w-full">
                                                Select All
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {branches.length === 0 ? (
                                                <div className="col-span-4 py-6 text-center text-sm text-muted-foreground">
                                                    {branchSearching
                                                        ? "Searching..."
                                                        : branchSearch
                                                        ? `No branches found for "${branchSearch}"`
                                                        : "No branches available"}
                                                </div>
                                            ) : (
                                                branches?.map((branch) => (
                                                <div key={branch.id} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-primary/50 transition-colors border ${field.value?.includes(branch.id.toString()) ? "bg-primary/50" : "border-transparent"}`}>
                                                    <input
                                                        type="checkbox"
                                                        id={`branch-${branch.id}`}
                                                        checked={field.value?.includes(branch.id.toString())}
                                                        onChange={(e) => {
                                                            const current = field.value || [];
                                                            const idStr = branch.id.toString();
                                                            if (e.target.checked) {
                                                                field.onChange([...current, idStr]);
                                                            } else {
                                                                field.onChange(current.filter((id) => id !== idStr));
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                    <Label htmlFor={`branch-${branch.id}`} className="text-sm font-medium leading-none cursor-pointer w-full">
                                                        {branch.name}
                                                    </Label>
                                                </div>
                                            )))}
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.branch_ids && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.branch_ids.message}</p>
                            )}
                        </div>
                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="name">Batch Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Enter Batch name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                placeholder="e.g. 3 months"
                                {...register("duration")}
                            />
                            {errors.duration && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.duration.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="price">Price<span className="text-red-500">*</span></Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("price", { valueAsNumber: true })}
                            />
                            {errors.price && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.price.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="discount_type">Discount Type</Label>
                            <Controller
                                name="discount_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.discount_type && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.discount_type.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="discount">Discount Value</Label>
                            <Input
                                id="discount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("discount", { valueAsNumber: true })}
                            />
                            {errors.discount && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.discount.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                {...register("start_date")}
                            />
                            {errors.start_date && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.start_date.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                {...register("end_date")}
                            />
                            {errors.end_date && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.end_date.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="apply_end_date">Apply End Date<span className="text-red-500">*</span></Label>
                            <Input
                                id="apply_end_date"
                                type="datetime-local"
                                {...register("apply_end_date")}
                            />
                            {errors.apply_end_date && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.apply_end_date.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="status">Status</Label>
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
                                            <SelectItem value="0">Draft</SelectItem>
                                            <SelectItem value="1">Published</SelectItem>
                                            <SelectItem value="2">Upcoming</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="is_online">Is Online?</Label>
                            <Controller
                                name="is_online"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Online</SelectItem>
                                            <SelectItem value="0">Offline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.is_online && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.is_online.message}</p>
                            )}
                        </div>


                        <div className="grid gap-2 relative pb-5">
                            <Label htmlFor="whatsapp_group_link">WhatsApp / Telegram Group Link</Label>
                            <Input
                                id="whatsapp_group_link"
                                placeholder="https://chat.whatsapp.com/..."
                                {...register("whatsapp_group_link")}
                            />
                            {errors.whatsapp_group_link && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">{errors.whatsapp_group_link.message}</p>
                            )}
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2 col-span-1 md:col-span-2 relative pb-6">
                            <Label htmlFor="teacher_ids">Teachers</Label>
                            <Controller
                                name="teacher_ids"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 border rounded-md p-4 max-h-60 overflow-y-auto bg-muted/20">
                                        {teachers.length > 0 ? (
                                            teachers.map((teacher) => (
                                                <div key={teacher.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors border border-transparent hover:border-accent">
                                                    <input
                                                        type="checkbox"
                                                        id={`teacher-${teacher.id}`}
                                                        checked={field.value?.includes(teacher.id.toString())}
                                                        onChange={(e) => {
                                                            const currentValues = field.value || [];
                                                            const teacherIdStr = teacher.id.toString();
                                                            if (e.target.checked) {
                                                                field.onChange([...currentValues, teacherIdStr]);
                                                            } else {
                                                                field.onChange(currentValues.filter((id) => id !== teacherIdStr));
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                    <Label
                                                        htmlFor={`teacher-${teacher.id}`}
                                                        className="text-sm font-medium leading-none cursor-pointer w-full"
                                                    >
                                                        {teacher.name}
                                                    </Label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground col-span-full text-center py-4">
                                                {selectedBranchIds && selectedBranchIds.length > 0 ? "No teachers found for the first selected branch." : "Please select at least one branch first."}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.teacher_ids && (
                                <p className="text-xs text-red-500 absolute bottom-0 left-0">
                                    {errors.teacher_ids.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="cursor-pointer"
                        >
                            {isSubmitting ? "Submitting..." : batch ? "Update Batch" : "Add Batch"}
                        </Button>
                    </div>
                </form>
            </CardContent >
        </Card >
    );
}