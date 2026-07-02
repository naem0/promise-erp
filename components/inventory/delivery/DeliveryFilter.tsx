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
import { Search, Calendar, FilterX } from "lucide-react";
import PerPageSelect from "@/components/common/PerPageSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";

interface FilterFormValues {
  search?: string;
  delivery_branch?: string;
  delivery_type?: string;
  status?: string;
  delivery_date?: string;
  sort_order?: string;
}

export default function DeliveryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      delivery_branch: searchParams.get("delivery_branch") || "",
      delivery_type: searchParams.get("delivery_type") || "",
      status: searchParams.get("status") || "",
      delivery_date: searchParams.get("delivery_date") || "",
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
        params.delete("page"); // Reset to page 1 on filter change
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

  const handleSelectChange = (name: keyof FilterFormValues) => (value: string) => {
    setValue(name, value);
  };

  const handleReset = () => {
    reset({
      search: "",
      delivery_branch: "",
      delivery_type: "",
      status: "",
      delivery_date: "",
      sort_order: "",
    });
    router.replace(pathname, { scroll: false });
  };

  const currentSearch = searchParams.get("search") || "";
  const currentBranch = searchParams.get("delivery_branch") || "";
  const currentType = searchParams.get("delivery_type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentDate = searchParams.get("delivery_date") || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentPerPage = searchParams.get("per_page") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentBranch !== "" ||
    currentType !== "" ||
    currentStatus !== "" ||
    currentDate !== "" ||
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
            className="flex items-center gap-2 cursor-pointer"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Requisition ID/Challan..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Delivery Branch */}
        <div className="relative">
          <Controller
            name="delivery_branch"
            control={control}
            render={({ field }) => (
              <BranchSearchSelect
                value={field.value || ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  handleSelectChange("delivery_branch")(val || "");
                }}
                placeholder="Branch"
                className="w-full"
              />
            )}
          />
        </div>

        {/* Delivery Type */}
        <div className="relative">
          <Controller
            name="delivery_type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSelectChange("delivery_type")(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Delivery Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Courier">Courier</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Physical">Physical</SelectItem>
                  <SelectItem value="Air">Air</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Status */}
        <div className="relative">
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
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">Delivering</SelectItem>
                  <SelectItem value="3">Shipped</SelectItem>
                  <SelectItem value="4">Return</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="yyyy-mm-dd"
            className="pl-10"
            onFocus={(e) => (e.target.type = "date")}
            {...register("delivery_date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
          />
        </div>

        {/* Sort Order */}
        <div className="relative">
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
        </div>

        {/* Per Page Select */}
        <div className="flex items-center justify-start">
          <PerPageSelect className="w-full" />
        </div>
      </div>
    </div>
  );
}
