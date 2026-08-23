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

import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import CourseMultipleSearchSelect from "@/components/common/CourseMultipleSearchSelect";
import ConsultantSearchSelect from "@/components/common/ConsultantSearchSelect";
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange";
import PerPageSelect from "@/components/common/PerPageSelect";
import PermissionGuard from "@/components/auth/PermissionGuard";

import { CRMCategory } from "@/apiServices/crmCategoryService";
import { Course } from "@/apiServices/courseService";
import { CRMSource } from "@/apiServices/crmSourceService";
import { CrmStatus } from "@/apiServices/crmStatusesService";

// ==========================================
// Types & Interfaces
// ==========================================

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  status_id?: string;
  branch_id?: string;
  category_id?: string;
  source_id?: string;
  shift?: string;
  user_id?: string;
  per_page?: string;
  assignment_status?: string;
  course_id?: string;
}

interface CRMLeadsFilterProps {
  categories?: CRMCategory[];
  courses?: Course[];
  sources?: CRMSource[];
  statuses?: CrmStatus[];
}

export default function CRMLeadsFilter({
  categories = [],
  sources = [],
  statuses = [],
}: CRMLeadsFilterProps) {
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
        status_id: searchParams.get("status_id") || "",
        branch_id: searchParams.get("branch_id") || "",
        category_id: searchParams.get("category_id") || "",
        source_id: searchParams.get("source_id") || "",
        shift: searchParams.get("shift_id") || "",
        user_id: searchParams.get("user_id") || "",
        per_page: searchParams.get("per_page") || "",
        assignment_status: searchParams.get("assignment_status") || "",
        course_id: searchParams.get("course_id") || "",
      },
    });

  const watchedValues = watch();

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
      status_id: "",
      branch_id: "",
      category_id: "",
      source_id: "",
      shift: "",
      user_id: "",
      per_page: "",
      assignment_status: "",
      course_id: "",
    });
    router.replace(pathname, { scroll: false });
  };

  // ==========================================
  // Active Filter Detection
  // ==========================================

  const currentSearch = searchParams.get("search") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentStatusId = searchParams.get("status_id") || searchParams.get("status") || "";
  const currentBranchId = searchParams.get("branch_id") || "";
  const currentCategoryId = searchParams.get("category_id") || "";
  const currentSourceId = searchParams.get("source_id") || searchParams.get("source") || "";
  const currentShift = searchParams.get("shift") || searchParams.get("shift_id") || "";
  const currentUserId = searchParams.get("user_id") || "";
  const currentPerPage = searchParams.get("per_page") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentSortOrder !== "" ||
    currentStatusId !== "" ||
    currentBranchId !== "" ||
    currentCategoryId !== "" ||
    currentSourceId !== "" ||
    currentShift !== "" ||
    currentUserId !== "" ||
    (currentPerPage !== "" && currentPerPage !== "15") ||
    Boolean(searchParams.get("date_from")) ||
    Boolean(searchParams.get("date_to")) ||
    Boolean(searchParams.get("assignment_status")) ||
    Boolean(searchParams.get("course_id"));

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
            className="flex items-center gap-2"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Fields Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        
        {/* Search Input */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, referrer..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Courses Multi-select */}
        <div className="space-y-1 col-span-2">
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <CourseMultipleSearchSelect
                value={field.value ? field.value.split(",") : []}
                onValueChange={(selectedCourses) => {
                  const serializedValue = selectedCourses.join(",");
                  field.onChange(serializedValue);
                  handleSelectChange("course_id")(serializedValue);
                }}
                placeholder="Select course ..."
              />
            )}
          />
        </div>

        {/* Lead Status */}
        <Controller
          name="status_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("status_id")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.length > 0 ? (
                  statuses.map((statusItem) => (
                    <SelectItem key={statusItem.id} value={String(statusItem.id)}>
                      {statusItem.status}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No status found
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
            <BranchSearchSelect
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value ?? "");
                handleSelectChange("branch_id")(value ?? "");
              }}
              placeholder="Branch"
            />
          )}
        />

        {/* Lead Category */}
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
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No category found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />

        {/* Lead Source */}
        <Controller
          name="source_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("source_id")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lead Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.length > 0 ? (
                  sources.map((source) => (
                    <SelectItem key={source.id} value={String(source.id)}>
                      {source.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No source found
                  </SelectItem>
                )}
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

        {/* Counsellor (Permission Guarded) */}
        <PermissionGuard requiredPermission="view-leads">
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <ConsultantSearchSelect
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value ?? "");
                  handleSelectChange("user_id")(value ?? "");
                }}
                placeholder="Select Counsellor"
              />
            )}
          />
        </PermissionGuard>

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
          <DatePickerWithRange />
        </div>

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
