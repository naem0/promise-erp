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
import { CareerCategory } from "@/apiServices/careerService";

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  status?: string;
  job_type?: string;
  career_category_id?: string;
  branch_id?: string;
}

interface CareersFilterProps {
  branches: Branch[];
  categories: CareerCategory[];
}

export default function CareersFilter({
  branches,
  categories,
}: CareersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search: searchParams.get("search") || "",
        sort_order: searchParams.get("sort_order") || "",
        status: searchParams.get("status") || "",
        job_type: searchParams.get("job_type") || "",
        career_category_id: searchParams.get("career_category_id") || "",
        branch_id: searchParams.get("branch_id") || "",
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
      job_type: "",
      career_category_id: "",
      branch_id: "",
    });
    router.replace(pathname, { scroll: false });
  };

  const currentSearch = searchParams.get("search") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentJobType = searchParams.get("job_type") || "";
  const currentCategoryId = searchParams.get("career_category_id") || "";
  const currentBranchId = searchParams.get("branch_id") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentSortOrder !== "" ||
    currentStatus !== "" ||
    currentJobType !== "" ||
    currentCategoryId !== "" ||
    currentBranchId !== "";

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
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10"
            {...register("search")}
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
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Job Type */}
        <Controller
          name="job_type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("job_type")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Full Time</SelectItem>
                <SelectItem value="2">Part Time</SelectItem>
                <SelectItem value="3">Contractual</SelectItem>
                <SelectItem value="4">Internship</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Category */}
        <Controller
          name="career_category_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("career_category_id")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0">No Category</SelectItem>
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
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("branch_id")(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.length > 0 ? (
                  branches?.map((branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)}>
                      {branch.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0">No Branch</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
}
