"use client";
import { useEffect} from "react";
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
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange";

import { Branch } from "@/apiServices/branchService";
import { Consultant } from "@/apiServices/crmLeadsActions";
import { Course } from "@/apiServices/courseService";

interface FilterFormValues {
    consultant_id?: string;
    branch_id?: string;
    course_id?: string;
    status?: string;
    per_page?: string;
}

interface CRMLeadReportsFilterProps {
    branches: Branch[];
    consultants: Consultant[];
    courses: Course[];
}

export default function CRMLeadReportsFilter({
    branches,
    consultants,
    courses,
}: CRMLeadReportsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                consultant_id: searchParams.get("consultant_id") || "",
                branch_id: searchParams.get("branch_id") || "",
                course_id: searchParams.get("course_id") || "",
                status: searchParams.get("status") || "",
                per_page: searchParams.get("per_page") || "15",
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
            consultant_id: "",
            branch_id: "",
            course_id: "",
            status: "",
            per_page: "15",
        });
        router.replace(pathname, { scroll: false });
    };

    const hasActiveFilters =
        searchParams.get("consultant_id") ||
        searchParams.get("branch_id") ||
        searchParams.get("course_id") ||
        searchParams.get("status") ||
        searchParams.get("per_page") !== "15" && searchParams.get("per_page") !== null ||
        searchParams.get("date_from") ||
        searchParams.get("date_to");



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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">

                {/* Consultant */}
                <Controller
                    name="consultant_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("consultant_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Counsellor" />
                            </SelectTrigger>
                            <SelectContent>
                                {consultants?.length ? (
                                    consultants.map((consultant) => (
                                        <SelectItem key={consultant.id} value={String(consultant.id)}>
                                            {consultant.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        No Counsellor found
                                    </SelectItem>
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
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("branch_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches?.length ? (
                                    branches.map((branch) => (
                                        <SelectItem key={branch.id} value={String(branch.id)}>
                                            {branch.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        No branch found
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("course_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses?.length ? (
                                    courses.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.title}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        No course found
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("status")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">New</SelectItem>
                                <SelectItem value="2">Busy</SelectItem>
                                <SelectItem value="3">Interested</SelectItem>
                                <SelectItem value="4">Follow Up</SelectItem>
                                <SelectItem value="5">Enrolled</SelectItem>
                                <SelectItem value="6">Cancelled</SelectItem>
                                <SelectItem value="7">Not Received</SelectItem>
                                <SelectItem value="8">Call Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Date Range */}
                <DatePickerWithRange />

                {/* Per Page */}
                <Controller
                    name="per_page"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || "15"}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("per_page")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 Per Page</SelectItem>
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
