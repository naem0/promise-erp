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
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Consultant } from "@/apiServices/crmLeadsActions";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface FilterFormValues {
    search?: string;
    status?: string;
    user_id?: string;
    course_id?: string;
    date_from?: string;
    date_to?: string;
    per_page?: string;
}
 
export default function LeadsActivityFilter({ consultants }: { consultants?: Consultant[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
 
    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || "",
                user_id: searchParams.get("user_id") || "",
                course_id: searchParams.get("course_id") || "",
                date_from: searchParams.get("date_from") || "",
                date_to: searchParams.get("date_to") || "",
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
            search: "",
            status: "",
            user_id: "",
            course_id: "",
            date_from: "",
            date_to: "",
            per_page: "15",
        });
        setLocalDate(undefined);
        router.replace(pathname, { scroll: false });
    };
 
    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentUserId = searchParams.get("user_id") || "";
    const currentCourseId = searchParams.get("course_id") || "";
    const currentDateFrom = searchParams.get("date_from") || "";
    const currentDateTo = searchParams.get("date_to") || "";
    const currentPerPage = searchParams.get("per_page") || "15";
    const hasActiveFilters = 
        currentSearch !== "" || 
        currentStatus !== "" || 
        currentUserId !== "" || 
        currentCourseId !== "" ||
        currentDateFrom !== "" || 
        currentDateTo !== "" ||
        currentPerPage !== "15";

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
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative lg:col-span-1 xl:col-span-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search lead name..."
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
                            value={field.value}
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
 
                {/* Assigned Consultant */}
                <PermissionGuard requiredPermission="view-lead-activity-list">
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
                                {consultants?.map((consultant) => (
                                    <SelectItem key={consultant.id} value={String(consultant.id)}>
                                        {consultant.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                </PermissionGuard>

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <CourseSearchSelect
                            value={field.value || null}
                            onValueChange={(value) => {
                                field.onChange(value || "");
                                handleSelectChange("course_id")(value || "");
                            }}
                        />
                    )}
                />

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


                {/* Date Range */}
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
                                            if (range?.from && range?.to) {
                                                setValue("date_from", format(range.from, "yyyy-MM-dd"));
                                                setValue("date_to", format(range.to, "yyyy-MM-dd"));
                                            }
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
            </div>
        </div>
    );
}
