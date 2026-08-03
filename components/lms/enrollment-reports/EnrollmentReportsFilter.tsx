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

import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import BatchSearchSelect from "@/components/common/BatchSearchSelect";
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange";

interface FilterFormValues {
    course_id?: string;
    branch_id?: string;
    batch_id?: string;
    sort_order?: string;
    per_page?: string;
}

export default function EnrollmentReportsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                course_id: searchParams.get("course_id") || "",
                branch_id: searchParams.get("branch_id") || "",
                batch_id: searchParams.get("batch_id") || "",
                sort_order: searchParams.get("sort_order") || "desc",
                per_page: searchParams.get("per_page") || "",
            },
        });

    const watchedValues = watch();

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            let isChanged = false;

            const fields = ["course_id", "branch_id", "batch_id", "sort_order", "per_page"];
            fields.forEach((key) => {
                const urlValue = params.get(key) || "";
                const formValue = String(watchedValues[key as keyof FilterFormValues] || "");
                if (urlValue !== formValue) {
                    isChanged = true;
                }
            });

            if (isChanged) {
                params.delete("page");
                
                fields.forEach((key) => {
                    const value = watchedValues[key as keyof FilterFormValues];
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

    const handleReset = () => {
        reset({
            course_id: "",
            branch_id: "",
            batch_id: "",
            sort_order: "desc",
            per_page: "",
        });
        const params = new URLSearchParams();
        params.set("sort_order", "desc");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const hasActiveFilters =
        !!watchedValues.course_id ||
        !!watchedValues.branch_id ||
        !!watchedValues.batch_id ||
        !!searchParams.get("date_from") ||
        (watchedValues.sort_order !== "" && watchedValues.sort_order !== "desc") ||
        (watchedValues.per_page !== "");

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <CourseSearchSelect
                            value={field.value}
                            onValueChange={(val) => {
                                field.onChange(val || "");
                                setValue("batch_id", "");
                            }}
                            placeholder="Select Course"
                        />
                    )}
                />

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <BranchSearchSelect
                            value={field.value}
                            onValueChange={(val) => field.onChange(val || "")}
                            placeholder="Select Branch"
                        />
                    )}
                />

                {/* Batch */}
                <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                        <BatchSearchSelect
                            courseId={watchedValues.course_id}
                            value={field.value}
                            onValueChange={(val) => field.onChange(val || "")}
                            placeholder="Select Batch"
                        />
                    )}
                />

                {/* Date Range */}
                <DatePickerWithRange />

                {/* Sort Order */}
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
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

                {/* Per Page */}
                <Controller
                    name="per_page"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Show Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 per page</SelectItem>
                                <SelectItem value="30">30 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                                <SelectItem value="100">100 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
