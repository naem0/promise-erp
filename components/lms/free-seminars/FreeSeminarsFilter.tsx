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
import { Category } from "@/apiServices/categoryService";

interface FilterFormValues {
  search?: string;
  branch_id?: string;
  course_category_id?: string;
  seminar_type?: string;
  seminar_date_from?: string;
  seminar_date_to?: string;
  sort_order?: string;
}

interface FreeSeminarsFilterProps {
  branches: Branch[];
  categories: Category[];
}

export default function FreeSeminarsFilter({ branches, categories }: FreeSeminarsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      branch_id: searchParams.get("branch_id") || "",
      course_category_id: searchParams.get("course_category_id") || "",
      seminar_type: searchParams.get("seminar_type") || "",
      seminar_date_from: searchParams.get("seminar_date_from") || "",
      seminar_date_to: searchParams.get("seminar_date_to") || "",
      sort_order: searchParams.get("sort_order") || "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(watchedValues).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, String(value));
      }
    });

    const timer = setTimeout(() => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [JSON.stringify(watchedValues), router, pathname]);


  const handleReset = () => {
    reset({
      search: "",
      branch_id: "",
      course_category_id: "",
      seminar_type: "",
      seminar_date_from: "",
      seminar_date_to: "",
      sort_order: "",
    });
    router.replace(pathname);
  };

  const hasActiveFilters = Object.values(watchedValues).some(
    (value) => value && value !== ""
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
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search free seminars..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Branch */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Category */}
        <Controller
          name="course_category_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Seminar Type */}
        <Controller
          name="seminar_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Offline</SelectItem>
                <SelectItem value="1">Online</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Date From */}
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">
            Date From
          </label>
          <Input
            type="date"
            {...register("seminar_date_from")}
            className="w-full"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">
            Date To
          </label>
          <Input
            type="date"
            {...register("seminar_date_to")}
            className="w-full"
          />
        </div>

        {/* Sort Order */}
        <Controller
          name="sort_order"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
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
    </div>
  );
}
