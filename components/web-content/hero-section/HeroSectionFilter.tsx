
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

import { Branch } from "@/apiServices/branchService";

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  status?: string;
  branch_id?: string;
}

export default function HeroSectionFilter({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      status: searchParams.get("status") || "",
      branch_id: searchParams.get("branch_id") || "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      Object.entries(watchedValues).forEach(([key, value]) => {
        if (value && value !== "" && value !== "all") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [JSON.stringify(watchedValues), router, pathname]);

  const handleSelectChange = (name: keyof FilterFormValues) => (value: string) => {
    setValue(name, value);
  };

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      status: "",
      branch_id: "all",
    });
  };

  const currentSearch = searchParams.get("search") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentBranchId = searchParams.get("branch_id") || "";
  const hasActiveFilters = currentSearch !== "" || currentSortOrder !== "" || currentStatus !== "" || currentBranchId !== "";

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Search Input */}
        <div className="relative col-span-1 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hero sections..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Branch Filter */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("branch_id")(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {Array.isArray(branches) && branches?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {String(branch.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="sort_order"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSelectChange("sort_order")(value);
                }}
                value={field.value}
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
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSelectChange("status")(value);
                }}
                value={field.value}
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
        </div>
      </div>
    </div>
  );
}
