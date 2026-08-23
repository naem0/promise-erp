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
import PerPageSelect from "@/components/common/PerPageSelect";

import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import DivisionSearchSelect from "@/components/common/DivisionSearchSelect";
import DistrictSearchSelect from "@/components/common/DistrictSearchSelect";
import BatchSearchSelect from "@/components/common/BatchSearchSelect";

interface FilterFormValues {
  search?: string;
  apply_branch_id?: string;
  division_id?: string;
  district_id?: string;
  education?: string;
  apply_status?: string;
  applied_batch?: string;
  sort_order?: string;
}

export default function DydApplicationsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search: searchParams.get("search") || "",
        apply_branch_id:
          searchParams.get("apply_branch_id") ||
          searchParams.get("branch_id") ||
          "",
        division_id: searchParams.get("division_id") || "",
        district_id: searchParams.get("district_id") || "",
        education: searchParams.get("education") || "",
        apply_status:
          searchParams.get("apply_status") ||
          searchParams.get("status") ||
          "",
        applied_batch: searchParams.get("applied_batch") || "",
        sort_order: searchParams.get("sort_order") || "",
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
      apply_branch_id: "",
      division_id: "",
      district_id: "",
      education: "",
      apply_status: "",
      applied_batch: "",
      sort_order: "",
    });
    router.replace(pathname, { scroll: false });
  };

  const currentSearch = searchParams.get("search") || "";
  const currentBranch =
    searchParams.get("apply_branch_id") ||
    searchParams.get("branch_id") ||
    "";
  const currentDivision = searchParams.get("division_id") || "";
  const currentDistrict = searchParams.get("district_id") || "";
  const currentEducation = searchParams.get("education") || "";
  const currentStatus =
    searchParams.get("apply_status") || searchParams.get("status") || "";
  const currentBatch = searchParams.get("applied_batch") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentPerPage = searchParams.get("per_page") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentBranch !== "" ||
    currentDivision !== "" ||
    currentDistrict !== "" ||
    currentEducation !== "" ||
    currentStatus !== "" ||
    currentBatch !== "" ||
    currentSortOrder !== "" ||
    currentPerPage !== "";

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
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or dyd_roll..."
            className="pl-10 text-sm"
            {...register("search")}
          />
        </div>

        {/* Apply Status */}
        <Controller
          name="apply_status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("apply_status")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Initial Applied</SelectItem>
                <SelectItem value="2">Exam Notice Sent</SelectItem>
                <SelectItem value="3">Written Passed</SelectItem>
                <SelectItem value="4">Final Selected</SelectItem>
                <SelectItem value="5">Not Selected</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Branch Filter */}
        <Controller
          name="apply_branch_id"
          control={control}
          render={({ field }) => (
            <BranchSearchSelect
              value={field.value || ""}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("apply_branch_id")(newValue);
              }}
              placeholder="Filter by Branch"
              className="w-full"
            />
          )}
        />

        {/* Division Filter */}
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

        {/* District Filter */}
        <Controller
          name="district_id"
          control={control}
          render={({ field }) => (
            <DistrictSearchSelect
              value={field.value || ""}
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

        {/* Batch Filter */}
        <Controller
          name="applied_batch"
          control={control}
          render={({ field }) => (
            <BatchSearchSelect
              value={field.value || ""}
              onValueChange={(val) => {
                const newValue = val || "";
                field.onChange(newValue);
                handleSelectChange("applied_batch")(newValue);
              }}
              placeholder="Filter by Batch"
              className="w-full"
            />
          )}
        />

        {/* Education Input/Select */}
        <div>
          <Input
            placeholder="Education (e.g. Diploma, HSC...)"
            className="w-full text-sm"
            {...register("education")}
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

        {/* Per Page Select */}
        <div className="flex items-center justify-start">
          <PerPageSelect className="w-full" />
        </div>
      </div>
    </div>
  );
}
