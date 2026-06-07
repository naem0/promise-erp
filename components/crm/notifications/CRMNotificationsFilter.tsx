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

interface FilterFormValues {
    course?: string;
    per_page?: string;
}

export default function CRMNotificationsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                course: searchParams.get("course") || searchParams.get("course_id") || "",
                per_page: searchParams.get("per_page") || "30",
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
                    if (value !== undefined && value !== null && value !== "") {
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
            course: "",
            per_page: "30",
        });
        
        const params = new URLSearchParams(searchParams.toString());
        params.delete("course");
        params.delete("course_id");
        params.delete("per_page");
        params.delete("page");
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentCourse = searchParams.get("course") || searchParams.get("course_id") || "";
    const currentPerPage = searchParams.get("per_page") || "30";

    const hasActiveFilters =
        currentCourse !== "" ||
        currentPerPage !== "30";

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
                        className="flex items-center gap-2 cursor-pointer animate-in fade-in duration-200"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 ">
                {/* Course Search Select */}
                <div className="w-full">
                    <Controller
                        name="course"
                        control={control}
                        render={({ field }) => (
                            <CourseSearchSelect
                                value={field.value || null}
                                onValueChange={(val) => {
                                    field.onChange(val);
                                    handleSelectChange("course")(val || "");
                                }}
                                placeholder="Filter by Course"
                                className="h-10"
                            />
                        )}
                    />
                </div>

                {/* Per Page */}
                <Controller
                    name="per_page"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || "30"}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("per_page")(value);
                            }}
                        >
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 Per Page</SelectItem>
                                <SelectItem value="50">50 Per Page</SelectItem>
                                <SelectItem value="100">100 Per Page</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
