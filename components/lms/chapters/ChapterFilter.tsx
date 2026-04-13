"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

import { Branch } from "@/apiServices/branchService";
import { Batch } from "@/apiServices/batchService";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";

interface FilterFormValues {
    search?: string;
    batch_id?: string;
    course_id?: string;
    branch_id?: string;
    sort_by?: string;
    sort_order?: string;
}

interface ChapterFilterProps {
    branches: Branch[];
    batches: Batch[];
}

export default function ChapterFilter({
    branches,
    batches,
}: ChapterFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch } = useForm<FilterFormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
            batch_id: searchParams.get("batch_id") || "",
            course_id: searchParams.get("course_id") || "",
            branch_id: searchParams.get("branch_id") || "",
            sort_by: searchParams.get("sort_by") || "created_at",
            sort_order: searchParams.get("sort_order") || "desc",
        },
    });

    const watchedValues = watch();

    /*
     * Auto update query params when filter changes
     */
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        Object.entries(watchedValues).forEach(([key, value]) => {
            if (value) params.set(key, String(value));
            else params.delete(key);
        });

        const timer = setTimeout(() => {
            router.replace(`${pathname}?${params.toString()}`);
        }, 400);

        return () => clearTimeout(timer);
    }, [JSON.stringify(watchedValues), router, pathname]);

    /*
     * Reset Filters
     */
    const handleReset = () => {
        reset({
            search: "",
            batch_id: "",
            branch_id: "",
            course_id: "",
            sort_by: "",
            sort_order: "",
        });
        router.replace(pathname);
    };

    const hasActiveFilters = Object.values(watchedValues).some(
        (value) => value && value !== "" && value !== false
    )

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">

                {/* Search */}
                <div className="relative col-span-1 lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search chapters..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

                {/* Batch */}
                <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {batches.map((batch) => (
                                    <SelectItem key={batch.id} value={String(batch.id)}>
                                        {batch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <CourseSearchSelect 
                            value={field.value || ""} 
                            onValueChange={field.onChange}
                            placeholder="Select Course"
                        />
                    )}
                />

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches?.map((branch) => (
                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Sort Order */}
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
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
