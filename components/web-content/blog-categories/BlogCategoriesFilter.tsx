"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { FilterX, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  status?: string;
}

export default function BlogCategoriesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search: searchParams.get("search") || "",
        sort_order: searchParams.get("sort_order") || "",
        status: searchParams.get("status") || "",
      },
    });

  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 400);

  // Update URL only when debounced values actually change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // reset pagination on filter change

    Object.entries(debouncedValues).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    // Only update URL if something changed
    if (newQuery !== currentQuery) {
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false }); // scroll: false prevents jumping to top
    }
  }, [debouncedValues, pathname, router, searchParams]);

  const handleSelectChange =
    (name: keyof FilterFormValues) => (value: string) => {
      setValue(name, value);
    };

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      status: "",
    });
    router.replace(pathname);
  };

  const hasActiveFilters = Object.values(watchedValues).some(
    (value) => value && value !== "",
  );

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
            <FilterX className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog categories..."
            className="pl-10"
            {...register("search")}
          />
        </div>

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
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
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
  );
}

