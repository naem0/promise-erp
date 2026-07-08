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
import { Branch } from "@/apiServices/branchService";
import { Division } from "@/apiServices/divisionService";
import { Category } from "@/apiServices/categoryService";
import { Search, FilterX } from "lucide-react";

interface FilterFormValues {
  search?: string;
  sort_order?: string;
  level?: string;
  branch_id?: string;
  category_id?: string;
}

interface CourseFilterProps {
  branches: Branch[];
  categories: Category[];
}

export default function CourseFilter({
  branches,
  categories,
}: CourseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { register, control, reset, watch } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      level: searchParams.get("level") || "",
      branch_id: searchParams.get("branch_id") || "",
      category_id: searchParams.get("category_id") || "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    Object.entries(watchedValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    const timer = setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [JSON.stringify(watchedValues), router, pathname]);

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      level: "",
      branch_id: "",
      category_id: "",
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
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Search Input */}
        <div className="relative col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Sort By */}
        <Controller
          name="sort_order"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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

        {/* Level */}
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Branch */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches?.length === 0 ? (
                  <SelectItem value="">No Branches</SelectItem>
                ) : (
                  branches?.map((branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)}>
                      {branch.name}
                    </SelectItem>
                  ))
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
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.length === 0 ? (
                  <SelectItem value="">No Categories</SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
}
