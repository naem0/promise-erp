"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import { Search, FilterX } from "lucide-react";

interface FilterFormValues {
    search?: string;
    sort_order?: string;
    status?: string;
    course_id?: string;
}

export default function CouponFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch } = useForm<FilterFormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
            sort_order: searchParams.get("sort_order") || "",
            status: searchParams.get("status") || "",
            course_id: searchParams.get("course_id") || "",
        },
    });

    const watchedValues = watch();

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        Object.entries(watchedValues).forEach(([key, value]) => {
            if (value) {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        if (params.has("page")) {
            params.set("page", "1");
        }

        const timer = setTimeout(() => {
            router.replace(`${pathname}?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [watchedValues.search, watchedValues.status, watchedValues.sort_order, watchedValues.course_id, router, pathname]);

    const handleReset = () => {
        reset({
            search: "",
            sort_order: "",
            status: "",
            course_id: "",
        });
        router.replace(pathname);
    };

    const hasActiveFilters = Object.values(watchedValues).some(
        (value) => value && value !== ""
    );

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
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search Input */}
                <div className="relative col-span-1 lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search coupons..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

                {/* Sort Order */}
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">ASC</SelectItem>
                                <SelectItem value="desc">DESC</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="0">Inactive</SelectItem>
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
            </div>
        </div>
    );
}

