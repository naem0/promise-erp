"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filters } from "@/apiServices/courseListPublicService";
import CourseFilterSection from "./CourseFilterSection";
import { useCourseFilter } from "./CourseFilterContext";

interface CourseMobileFilterBarProps {
  filters: Filters;
}

export default function CourseMobileFilterBar({ filters }: CourseMobileFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startFilterTransition, isMobileFilterOpen, setIsMobileFilterOpen } =
    useCourseFilter();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Sync search state when searchParam changes externally
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounce search input to update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (search.trim() !== currentSearch.trim()) {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
          params.set("search", search.trim());
        } else {
          params.delete("search");
        }
        params.delete("page");

        const newQuery = params.toString();
        const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
        startFilterTransition(() => {
          router.replace(newUrl, { scroll: false });
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const hasActiveFilters = Boolean(
    searchParams.get("search") ||
    searchParams.get("course_type") ||
    searchParams.get("category_id") ||
    searchParams.get("level") ||
    searchParams.get("min_price") ||
    searchParams.get("max_price")
  );

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Search Input Box with Icon on the right */}
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search Branch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 h-11 rounded-xl bg-white border border-gray-200 shadow-xs text-sm"
        />
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Filter Icon Button triggering Sheet Drawer */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-xs relative p-0 flex items-center justify-center cursor-pointer"
            aria-label="Filter Options"
          >
            <Filter className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
            {hasActiveFilters && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="px-0 pt-0 pb-4 border-b border-gray-100">
            <SheetTitle className="text-lg font-bold text-secondary flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Course Filters
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <CourseFilterSection filters={filters} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
