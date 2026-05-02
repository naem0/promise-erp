"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

import { Branch } from "@/apiServices/branchService";
import { Course } from "@/apiServices/courseService";
import { Batch } from "@/apiServices/batchService";

interface FilterFormValues {
    course_id?: string;
    branch_id?: string;
    batch_id?: string;
    report_type?: string;
    sort_order?: string;
}

interface EnrollmentReportsFilterProps {
    branches: Branch[];
    courses: Course[];
    batches: Batch[];
}

export default function EnrollmentReportsFilter({
    branches,
    courses,
    batches,
}: EnrollmentReportsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                course_id: searchParams.get("course_id") || "",
                branch_id: searchParams.get("branch_id") || "",
                batch_id: searchParams.get("batch_id") || "",
                report_type: searchParams.get("report_type") || "",
                sort_order: searchParams.get("sort_order") || "desc",
            },
        });

    const watchedValues = watch();

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            let isChanged = false;

            Object.entries(watchedValues).forEach(([key, value]) => {
                const urlValue = params.get(key) || "";
                const formValue = String(value || "");
                if (urlValue !== formValue) {
                    isChanged = true;
                }
            });

            if (isChanged) {
                params.delete("page");
                Object.entries(watchedValues).forEach(([key, value]) => {
                    if (value && value !== "") {
                        params.set(key, String(value));
                    } else {
                        params.delete(key);
                    }
                });

                const newUrl = `${pathname}?${params.toString()}`;
                router.replace(newUrl, { scroll: false });
            }
        }, 600);

        return () => {
            clearTimeout(handler);
        };
    }, [JSON.stringify(watchedValues), router, pathname, searchParams]);

    const handleSelectChange =
        (name: keyof FilterFormValues) => (value: string) => {
            setValue(name, value);
        };

    const handleReset = () => {
        reset({
            course_id: "",
            branch_id: "",
            batch_id: "",
            report_type: "",
            sort_order: "desc",
        });
        const params = new URLSearchParams();
        params.set("sort_order", "desc");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentCourseId = searchParams.get("course_id") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentBatchId = searchParams.get("batch_id") || "";
    const currentReportType = searchParams.get("report_type") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";

    const hasActiveFilters =
        currentCourseId !== "" ||
        currentBranchId !== "" ||
        currentBatchId !== "" ||
        currentReportType !== "" ||
        (currentSortOrder !== "" && currentSortOrder !== "desc");

    return (
        <div className="p-6 mb-6 border rounded-xl bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("course_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {!courses || courses.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No courses available
                                    </div>
                                ) : (
                                    courses.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.title}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("branch_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {!branches || branches.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No branches available
                                    </div>
                                ) : (
                                    branches.map((branch) => (
                                        <SelectItem key={branch.id} value={String(branch.id)}>
                                            {branch.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Batch */}
                <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("batch_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {!batches || batches.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No batches available
                                    </div>
                                ) : (
                                    batches.map((batch) => (
                                        <SelectItem key={batch.id} value={String(batch.id)}>
                                            {batch.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Report Type */}
                <Controller
                    name="report_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("report_type")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="weekly">This Week</SelectItem>
                                <SelectItem value="monthly">This Month</SelectItem>
                                <SelectItem value="yearly">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />



                {/* Sort Order */}
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("sort_order")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">ASC</SelectItem>
                                <SelectItem value="desc">DESC</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
