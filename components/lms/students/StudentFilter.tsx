"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Search, FilterX } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import DivisionSearchSelect from "@/components/common/DivisionSearchSelect";
import DistrictSearchSelect from "@/components/common/DistrictSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import PerPageSelect from "@/components/common/PerPageSelect";

// ==========================================
// Types & Interfaces
// ==========================================

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  is_govt?: string;
  is_paid?: string;
  status?: string;
  is_blocked?: string;
  division_id?: string;
  district_id?: string;
  branch_id?: string;
  course_id?: string;
  per_page?: string;
}

export default function StudentFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ==========================================
  // Form Setup
  // ==========================================

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search: searchParams.get("search") || "",
        sort_order: searchParams.get("sort_order") || "",
        is_govt: searchParams.get("is_govt") || "",
        is_paid: searchParams.get("is_paid") || "",
        status: searchParams.get("status") || "",
        is_blocked: searchParams.get("is_blocked") || "",
        division_id: searchParams.get("division_id") || "",
        district_id: searchParams.get("district_id") || "",
        branch_id: searchParams.get("branch_id") || "",
        course_id: searchParams.get("course_id") || "",
        per_page: searchParams.get("per_page") || "",
      },
    });

  const watchedValues = watch();
  const divisionId = watch("division_id");

  // ==========================================
  // URL Synchronization (Debounced)
  // ==========================================

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
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [JSON.stringify(watchedValues), router, pathname, searchParams]);

  // ==========================================
  // Handlers
  // ==========================================

  const handleSelectChange =
    (name: keyof FilterFormValues) => (value: string) => {
      setValue(name, value);
    };

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      is_govt: "",
      is_paid: "",
      status: "",
      is_blocked: "",
      division_id: "",
      district_id: "",
      branch_id: "",
      course_id: "",
      per_page: "",
    });
    router.replace(pathname, { scroll: false });
  };

  // ==========================================
  // Active Filter Detection
  // ==========================================

  const currentSearch = searchParams.get("search") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentIsGovt = searchParams.get("is_govt") || "";
  const currentIsPaid = searchParams.get("is_paid") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentIsBlocked = searchParams.get("is_blocked") || "";
  const currentDivisionId = searchParams.get("division_id") || "";
  const currentDistrictId = searchParams.get("district_id") || "";
  const currentBranchId = searchParams.get("branch_id") || "";
  const currentCourseId = searchParams.get("course_id") || "";
  const currentPerPage = searchParams.get("per_page") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentSortOrder !== "" ||
    currentIsGovt !== "" ||
    currentIsPaid !== "" ||
    currentStatus !== "" ||
    currentIsBlocked !== "" ||
    currentDivisionId !== "" ||
    currentDistrictId !== "" ||
    currentBranchId !== "" ||
    currentCourseId !== "" ||
    (currentPerPage !== "" && currentPerPage !== "15");

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="p-6 mb-6 border rounded-xl bg-card shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Responsive Filter Fields Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        
        {/* Search Input */}
        <div className="relative col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email, phone..."
            className="pl-10 text-sm"
            {...register("search")}
          />
        </div>

        {/* Course Search Select */}
        <Controller
          name="course_id"
          control={control}
          render={({ field }) => (
            <CourseSearchSelect
              value={field.value || ""}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("course_id")(newValue);
              }}
              placeholder="Select Course"
              className="w-full"
            />
          )}
        />

        {/* Enrollment Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                handleSelectChange("status")(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Enrollment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_ENROLLED">Not Enrolled</SelectItem>
                <SelectItem value="FREE_COURSE_ENROLLED">Free Course Enrolled</SelectItem>
                <SelectItem value="PAID_COURSE_ENROLLED">Paid Course Enrolled</SelectItem>
                <SelectItem value="GOVT_COURSE_ENROLLED">Govt Course Enrolled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Is Govt Project */}
        <Controller
          name="is_govt"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                handleSelectChange("is_govt")(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Govt Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Govt</SelectItem>
                <SelectItem value="0">Non-Govt</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Is Paid / Payment Type */}
        <Controller
          name="is_paid"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                handleSelectChange("is_paid")(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Paid</SelectItem>
                <SelectItem value="0">Free</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Is Blocked / Account Status */}
        <Controller
          name="is_blocked"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                handleSelectChange("is_blocked")(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Active</SelectItem>
                <SelectItem value="1">Blocked</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Branch Search Select */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <BranchSearchSelect
              value={field.value || ""}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("branch_id")(newValue);
              }}
              placeholder="Filter by Branch"
              className="w-full"
            />
          )}
        />

        {/* Division Search Select */}
        <Controller
          name="division_id"
          control={control}
          render={({ field }) => (
            <DivisionSearchSelect
              value={field.value || ""}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("division_id")(newValue);
              }}
              placeholder="Filter by Division"
              className="w-full"
            />
          )}
        />

        {/* District Search Select */}
        <Controller
          name="district_id"
          control={control}
          render={({ field }) => (
            <DistrictSearchSelect
              value={field.value || ""}
              divisionId={divisionId || undefined}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("district_id")(newValue);
              }}
              placeholder="Filter by District"
              className="w-full"
            />
          )}
        />

        {/* Sort Order */}
        <Controller
          name="sort_order"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                handleSelectChange("sort_order")(val);
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
