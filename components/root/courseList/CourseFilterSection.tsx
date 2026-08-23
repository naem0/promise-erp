"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, FilterX } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filters } from "@/apiServices/courseListPublicService";
import { useCourseFilter } from "./CourseFilterContext";

interface CourseFilterSectionProps {
  filters: Filters;
  onFilterSelect?: () => void;
}

const CourseFilterSection = ({
  filters,
  onFilterSelect,
}: CourseFilterSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startFilterTransition, closeMobileFilter } = useCourseFilter();

  const getParam = (key: string) => searchParams.get(key) || "";

  // ------------------ DERIVED VALUES FROM URL ------------------
  const courseType = getParam("course_type");
  const categories = getParam("category_id");
  const level = getParam("level");
  const minPriceParam = getParam("min_price");
  const maxPriceParam = getParam("max_price");

  const defaultMin = filters.price_range?.min ?? 0;
  const defaultMax = filters.price_range?.max ?? 100000;

  // ------------------ LOCAL STATES (ONLY FOR SEARCH & SLIDER) ------------------
  const [search, setSearch] = useState(getParam("search"));
  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    minPriceParam ? Number(minPriceParam) : defaultMin,
    maxPriceParam ? Number(maxPriceParam) : defaultMax,
  ]);

  // Sync search input state when URL search param changes externally (e.g. back navigation)
  useEffect(() => {
    setSearch(getParam("search"));
  }, [searchParams]);

  // Sync price slider state when URL min/max price params change externally
  useEffect(() => {
    const minP = getParam("min_price");
    const maxP = getParam("max_price");
    if (minP && maxP) {
      setTempPriceRange([Number(minP), Number(maxP)]);
    } else {
      setTempPriceRange([defaultMin, defaultMax]);
    }
  }, [searchParams, defaultMin, defaultMax]);

  // ------------------ SEARCH DEBOUNCE TO URL ------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlSearch = getParam("search");
      if (search.trim() !== urlSearch.trim()) {
        updateUrlParam("search", search.trim());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ------------------ HELPER TO UPDATE URL ------------------
  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination on filter change

    const newQuery = params.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
    const currentQuery = searchParams.toString();
    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (newUrl !== currentUrl) {
      startFilterTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    }
  };

  const notifyFilterSelect = () => {
    closeMobileFilter();
    if (onFilterSelect) {
      onFilterSelect();
    }
  };

  const handleCheckboxToggle = (
    paramKey: string,
    currentValueStr: string,
    idToToggle: string,
    checked: boolean
  ) => {
    const arr = currentValueStr ? currentValueStr.split(",") : [];
    const nextArr = checked
      ? [...arr, idToToggle]
      : arr.filter((v) => v !== idToToggle);
    updateUrlParam(paramKey, nextArr.join(","));
    notifyFilterSelect();
  };

  const handleSingleSelectToggle = (
    paramKey: string,
    currentValue: string,
    targetValue: string
  ) => {
    const newValue = currentValue === targetValue ? "" : targetValue;
    updateUrlParam(paramKey, newValue);
    notifyFilterSelect();
  };

  const handlePriceCommit = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min_price", String(value[0]));
    params.set("max_price", String(value[1]));
    params.delete("page");

    const newQuery = params.toString();
    const newUrl = `${pathname}?${newQuery}`;
    startFilterTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
    notifyFilterSelect();
  };

  const handleReset = () => {
    setSearch("");
    setTempPriceRange([defaultMin, defaultMax]);
    startFilterTransition(() => {
      router.replace(pathname, { scroll: false });
    });
    notifyFilterSelect();
  };

  const currentCategoriesArray = categories.split(",").filter(Boolean);
  const currentLevelsArray = level.split(",").filter(Boolean);

  const hasActiveFilters = Boolean(
    search ||
    courseType ||
    categories ||
    level ||
    minPriceParam ||
    maxPriceParam
  );

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={[
          "search",
          "course-type",
          "course-category",
          "price-range",
          "level",
        ]}
      >
        {/* SEARCH */}
        <AccordionItem value="search">
          <AccordionTrigger className="text-base font-semibold text-secondary">
            Search by Course
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search by course name..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* COURSE TYPE */}
        <AccordionItem value="course-type">
          <AccordionTrigger className="text-base font-semibold text-secondary">
            Course Type
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {filters.course_types?.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`course-type-${item.id}`}
                  checked={courseType === item.name}
                  onCheckedChange={() =>
                    handleSingleSelectToggle("course_type", courseType, item.name)
                  }
                />
                <Label className="cursor-pointer" htmlFor={`course-type-${item.id}`}>
                  {item.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* CATEGORY */}
        <AccordionItem value="course-category">
          <AccordionTrigger className="text-base font-semibold text-secondary">
            Course Category
          </AccordionTrigger>
          <AccordionContent className="space-y-3 max-h-60 overflow-y-auto">
            {filters.categories?.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${item.id}`}
                  checked={currentCategoriesArray.includes(item.id.toString())}
                  onCheckedChange={(checked) =>
                    handleCheckboxToggle(
                      "category_id",
                      categories,
                      item.id.toString(),
                      checked as boolean
                    )
                  }
                />
                <Label className="cursor-pointer" htmlFor={`category-${item.id}`}>
                  {item.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* PRICE */}
        <AccordionItem value="price-range">
          <AccordionTrigger className="text-base font-semibold text-secondary">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <Slider
              min={defaultMin}
              max={defaultMax}
              step={100}
              value={tempPriceRange}
              onValueChange={(v) => {
                setTempPriceRange(v);
              }}
              onValueCommit={(v) => {
                handlePriceCommit(v);
              }}
              className="py-4"
            />

            <div className="flex justify-between text-sm">
              <span>৳ {tempPriceRange[0]}</span>
              <span>৳ {tempPriceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* LEVEL */}
        <AccordionItem value="level">
          <AccordionTrigger className="text-base font-semibold text-secondary">
            Level
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {filters.levels?.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${item.id}`}
                  checked={currentLevelsArray.includes(item.id.toString())}
                  onCheckedChange={(checked) =>
                    handleCheckboxToggle(
                      "level",
                      level,
                      item.id.toString(),
                      checked as boolean
                    )
                  }
                />
                <Label className="cursor-pointer" htmlFor={`level-${item.id}`}>
                  {item.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasActiveFilters && (
        <Button className="w-full cursor-pointer" onClick={handleReset}>
          <FilterX className="h-4 w-4 mr-2" />
          Clear Query Filters
        </Button>
      )}
    </div>
  );
};

export default CourseFilterSection;
