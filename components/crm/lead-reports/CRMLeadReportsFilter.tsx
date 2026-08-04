"use client";
import { useEffect, useState } from "react";
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
import { Consultant } from "@/apiServices/crmLeadsActions";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import PerPageSelect from "@/components/common/PerPageSelect";
import ConsultantSearchSelect from "@/components/common/ConsultantSearchSelect";

interface FilterFormValues {
    consultant_id?: string;
    branch_id?: string;
    status?: string;
    per_page?: string;
}

interface CRMLeadReportsFilterProps {
    consultants: Consultant[];
}

export default function CRMLeadReportsFilter({
    consultants,
}: CRMLeadReportsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // course_ids is managed separately as string[]
    const [selectedCourses, setSelectedCourses] = useState<string[]>(() => {
        const raw = searchParams.get("course_id") || "";
        return raw ? raw.split(",").filter(Boolean) : [];
    });

    const { control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                consultant_id: searchParams.get("consultant_id") || "",
                branch_id: searchParams.get("branch_id") || "",
                status: searchParams.get("status") || "",
                per_page: searchParams.get("per_page") || "",
            },
        });

    const watchedValues = watch();

    // Sync form values (except course) to URL
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

        return () => clearTimeout(handler);
    }, [JSON.stringify(watchedValues), router, pathname, searchParams]);

    // Sync selectedCourses to URL separately
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentInUrl = params.get("course_id") || "";
            const newValue = selectedCourses.join(",");

            if (currentInUrl !== newValue) {
                params.delete("page");
                if (newValue) {
                    params.set("course_id", newValue);
                } else {
                    params.delete("course_id");
                }
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [JSON.stringify(selectedCourses), router, pathname, searchParams]);

    const handleSelectChange =
        (name: keyof FilterFormValues) => (value: string) => {
            setValue(name, value);
        };

    const handleReset = () => {
        reset({
            consultant_id: "",
            branch_id: "",
            status: "",
            per_page: "",
        });
        setSelectedCourses([]);
        router.replace(pathname, { scroll: false });
    };

    const hasActiveFilters =
        searchParams.get("consultant_id") ||
        searchParams.get("branch_id") ||
        searchParams.get("course_id") ||
        searchParams.get("status") ||
        (searchParams.get("per_page") !== "15" && searchParams.get("per_page") !== null) ||
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
                 {/* Course - Multi-select CourseSearchSelect */}
                <div className="col-span-2">
                <CourseSearchSelect
                    multiple={true}
                    value={selectedCourses}
                    onValueChange={(val) => setSelectedCourses(val)}
                    placeholder="Search by Course"
                />
                </div>

                {/* Consultant */}
                <Controller
                    name="consultant_id"
                    control={control}
                    render={({ field }) => (
                        <ConsultantSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value ?? "");
                                handleSelectChange("consultant_id")(value ?? "");
                            }}
                            placeholder="Select Counsellor"
                        />
                    )}
                />

                {/* Branch - BranchSearchSelect */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <BranchSearchSelect
                            value={field.value || ""}
                            onValueChange={(val) => {
                                field.onChange(val || "");
                                handleSelectChange("branch_id")(val || "");
                            }}
                            placeholder="Search by Branch"
                        />
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

                {/* Per Page Select */}
                <div className="flex items-center justify-start">
                    <PerPageSelect
                        control={control}
                        name="per_page"
                        onValueChange={handleSelectChange("per_page")}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
