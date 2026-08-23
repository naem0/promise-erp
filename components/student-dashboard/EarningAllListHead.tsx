"use client";


import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterX, Plus, Search } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterFormValues {
  search: string;
  sort_order: string;
  status: string;
}

const EarningAllListHead = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, watch, setValue, reset } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      status: searchParams.get("status") || "",
    },
  });

  // Watch all form values
  const watchedValues = watch(["search", "sort_order", "status"]);

  // Debounce all filters together
  const debouncedValues = useDebounce(watchedValues, 800);
  const [debouncedSearch, debouncedSortOrder, debouncedStatus] =
    debouncedValues;

  const hasActiveFilters =
    !!debouncedSearch || !!debouncedSortOrder || !!debouncedStatus;

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (debouncedSortOrder) params.set("sort_order", debouncedSortOrder);
    if (debouncedStatus) params.set("status", debouncedStatus);

    // Always remove page param when filters change
    params.delete("page");

    const newUrl = `${pathname}?${params.toString()}`;

    // Only update if URL is actually different
    const currentUrl = `${pathname}?${searchParams.toString()}`;
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [debouncedSearch, debouncedSortOrder, debouncedStatus, pathname, router]);

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      status: "",
    });
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-md shadow">
      {/* Left Side: Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("search")}
            placeholder="Search by name or details"
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select
            value={debouncedSortOrder}
            onValueChange={(v) => setValue("sort_order", v)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">ASC</SelectItem>
              <SelectItem value="desc">DESC</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={debouncedStatus}
            onValueChange={(v) => setValue("status", v)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Pending</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
              <SelectItem value="2">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Side: Buttons */}
      <div className="flex gap-2">
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex gap-2"
          >
            <FilterX className="h-4 w-4" />
            Clear
          </Button>
        )}

        <Button asChild>
          <Link href="/student/myearnings/add" className="flex gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EarningAllListHead;
