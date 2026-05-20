"use client";
import { useEffect, useState } from "react";
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
import { Search, FilterX, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { Branch } from "@/apiServices/branchService";
import { CRMCategory } from "@/apiServices/crmCategoryService";
import { Consultant } from "@/apiServices/crmLeadsActions";
import { Course } from "@/apiServices/courseService";

interface FilterFormValues {
    search?: string;
    sort_order?: string;
    status?: string;
    branch_id?: string;
    category_id?: string;
    source?: string;
    shift?: string;
    user_id?: string;
    per_page?: string;
    date_from?: string;
    date_to?: string;
    assignment_status?: string;
    course_id?: string;
}

interface CRMLeadsFilterProps {
    branches: Branch[];
    categories?: CRMCategory[];
    consultants?: Consultant[];
    courses?: Course[];
}

export default function CRMLeadsFilter({
    branches,
    categories,
    consultants,
    courses,
}: CRMLeadsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                sort_order: searchParams.get("sort_order") || "",
                status: searchParams.get("status") || "",
                branch_id: searchParams.get("branch_id") || "",
                category_id: searchParams.get("category_id") || "",
                source: searchParams.get("source") || "",
                shift: searchParams.get("shift") || "",
                user_id: searchParams.get("user_id") || "",
                per_page: searchParams.get("per_page") || "15",
                date_from: searchParams.get("date_from") || "",
                date_to: searchParams.get("date_to") || "",
                assignment_status: searchParams.get("assignment_status") || "",
                course_id: searchParams.get("course_id") || "",
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
            search: "",
            sort_order: "",
            status: "",
            branch_id: "",
            category_id: "",
            source: "",
            shift: "",
            user_id: "",
            per_page: "15",
            date_from: "",
            date_to: "",
            assignment_status: "",
            course_id: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentCategoryId = searchParams.get("category_id") || "";
    const currentSource = searchParams.get("source") || "";
    const currentShift = searchParams.get("shift") || "";
    const currentUserId = searchParams.get("user_id") || "";
    const currentPerPage = searchParams.get("per_page") || "15";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentSortOrder !== "" ||
        currentStatus !== "" ||
        currentBranchId !== "" ||
        currentCategoryId !== "" ||
        currentSource !== "" ||
        currentShift !== "" ||
        currentUserId !== "" ||
        currentPerPage !== "15" ||
        searchParams.get("date_from") !== "" && searchParams.get("date_from") !== null ||
        searchParams.get("date_to") !== "" && searchParams.get("date_to") !== null ||
        searchParams.get("assignment_status") !== "" && searchParams.get("assignment_status") !== null ||
        searchParams.get("course_id") !== "" && searchParams.get("course_id") !== null;

    const [localDate, setLocalDate] = useState<DateRange | undefined>({
        from: watchedValues.date_from ? new Date(watchedValues.date_from) : undefined,
        to: watchedValues.date_to ? new Date(watchedValues.date_to) : undefined,
    });

    useEffect(() => {
        setLocalDate({
            from: watchedValues.date_from ? new Date(watchedValues.date_from) : undefined,
            to: watchedValues.date_to ? new Date(watchedValues.date_to) : undefined,
        });
    }, [watchedValues.date_from, watchedValues.date_to]);

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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {/* Search */}
                <div className="relative col-span-2 md:col-span-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, phone, referrer..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

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
                                {
                                    branches?.length ? (
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

                {/* Category */}
                <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("category_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Lead Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.length ? (
                                    categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        No category found
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Source */}
                <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("source")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Lead Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Manual</SelectItem>
                                <SelectItem value="2">Website</SelectItem>
                                <SelectItem value="3">Facebook</SelectItem>
                                <SelectItem value="4">API</SelectItem>
                                <SelectItem value="5">WhatsApp</SelectItem>
                                <SelectItem value="6">Phone</SelectItem>
                                <SelectItem value="7">Referrer</SelectItem>
                                <SelectItem value="8">Others</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Shift */}
                <Controller
                    name="shift"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("shift")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Shift" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Morning</SelectItem>
                                <SelectItem value="2">Evening</SelectItem>
                                <SelectItem value="3">Night</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* User ID (Consultant) */}
                <Controller
                    name="user_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("user_id")(value);
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
                                        No consultant found
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
               
                {/* Assignment Status */}
                <div className="space-y-1">
                    <Controller
                        name="assignment_status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    handleSelectChange("assignment_status")(value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Assigned Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                    <SelectItem value="not_assigned">Unassigned</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Course */}
                <div className="space-y-1">
                    <Controller
                        name="course_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Course" />
                                </SelectTrigger>

                                <SelectContent>
                                    {courses?.length ? (
                                        courses.map((course) => (
                                            <SelectItem
                                                key={course.id}
                                                value={String(course.id)}
                                            >
                                                {course.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-course" disabled>
                                            No course found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
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
                    {/* Date Range Picker */}
                <div className="space-y-1">
                    <Field className="w-full">
                        <Popover>
                            <PopoverTrigger asChild className="cursor-pointer">
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-10",
                                        !watchedValues.date_from && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localDate?.from ? (
                                        localDate.to ? (
                                            <>
                                                {format(localDate.from, "LLL dd, y")} -{" "}
                                                {format(localDate.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(localDate.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex flex-col">
                                    <Calendar
                                        mode="range"
                                        defaultMonth={localDate?.from}
                                        selected={localDate}
                                        onSelect={(range) => {
                                            setLocalDate(range);
                                            // If both from and to are selected, update the form
                                            if (range?.from && range?.to) {
                                                setValue("date_from", format(range.from, "yyyy-MM-dd"));
                                                setValue("date_to", format(range.to, "yyyy-MM-dd"));
                                            }
                                            // If nothing is selected (cleared), update the form
                                            else if (!range?.from && !range?.to) {
                                                setValue("date_from", "");
                                                setValue("date_to", "");
                                            }
                                        }}
                                        numberOfMonths={2}
                                    />
                                    <div className="p-3 border-t flex justify-end gap-2 bg-slate-50/50">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                                            onClick={() => {
                                                setLocalDate(undefined);
                                                setValue("date_from", "");
                                                setValue("date_to", "");
                                            }}
                                        >
                                            Clear Range
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </Field>
                </div>
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
