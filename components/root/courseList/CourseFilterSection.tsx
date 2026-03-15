// "use client";
// import { useEffect, useState, useRef } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Search, FilterX } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Filters } from "@/apiServices/courseListPublicService";

// interface CourseFilterSectionProps {
//   filters: Filters;
// }

// const CourseFilterSection = ({ filters }: CourseFilterSectionProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const previousPathnameRef = useRef<string>(pathname);
//   const hasInitializedRef = useRef<boolean>(false);

//   const getParam = (key: string) => searchParams.get(key) || "";

//   // ------------------ STATES ------------------
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [courseType, setCourseType] = useState("");
//   const [categories, setCategories] = useState("");
//   const [level, setLevel] = useState("");
//   const [budgetScale, setBudgetScale] = useState("");
//   const [coursetrack, setCoursetrack] = useState("");
//   const [deliverymode, setDeliverymode] = useState("");
//   const [batchstatus, setBatchstatus] = useState("");

//   const [hasPriceInteracted, setHasPriceInteracted] = useState(false);
//   const [tempPriceRange, setTempPriceRange] = useState<number[]>([
//     filters.price_range?.min || 0,
//     filters.price_range?.max || 100000,
//   ]);

//   // ------------------ RESET ON PAGE CHANGE ------------------
//   useEffect(() => {
//     if (!hasInitializedRef.current) {
//       hasInitializedRef.current = true;
//       previousPathnameRef.current = pathname;
//       return;
//     }

//     if (previousPathnameRef.current !== pathname) {
//       setSearch("");
//       setDebouncedSearch("");
//       setCourseType("");
//       setCategories("");
//       setLevel("");
//       setBudgetScale("");
//       setCoursetrack("");
//       setDeliverymode("");
//       setBatchstatus("");
//       setHasPriceInteracted(false);
//       setTempPriceRange([
//         filters.price_range?.min || 0,
//         filters.price_range?.max || 100000,
//       ]);

//       router.replace(pathname, { scroll: false });
//       previousPathnameRef.current = pathname;
//     }
//   }, [pathname, router, filters.price_range]);

//   // ------------------ INITIALIZE FROM URL ------------------
//   useEffect(() => {
//     setSearch(getParam("search"));
//     setCourseType(getParam("course_type"));
//     setCategories(getParam("category_id"));
//     setLevel(getParam("level"));
//     setBudgetScale(getParam("budget_scale"));
//     setCoursetrack(getParam("course_track"));
//     setDeliverymode(getParam("delivery_mode"));
//     setBatchstatus(getParam("batch_status"));

//     const minPrice = getParam("min_price");
//     const maxPrice = getParam("max_price");

//     if (minPrice && maxPrice) {
//       const min = Number(minPrice);
//       const max = Number(maxPrice);
//       if (!isNaN(min) && !isNaN(max)) {
//         setTempPriceRange([min, max]);
//         setHasPriceInteracted(true);
//       }
//     } else {
//       setHasPriceInteracted(false);
//       setTempPriceRange([
//         filters.price_range?.min || 0,
//         filters.price_range?.max || 100000,
//       ]);
//     }

//     setTimeout(() => {
//       setDebouncedSearch(getParam("search"));
//     }, 100);
//   }, [filters.price_range]);

//   // ------------------ SEARCH DEBOUNCE ------------------
//   useEffect(() => {
//     const timeout = setTimeout(() => setDebouncedSearch(search), 600);
//     return () => clearTimeout(timeout);
//   }, [search]);

//   // ------------------ PRICE DEBOUNCE ------------------
//   const [debouncedPriceRange, setDebouncedPriceRange] =
//     useState(tempPriceRange);

//   useEffect(() => {
//     if (!hasPriceInteracted) return;
//     const timeout = setTimeout(() => {
//       setDebouncedPriceRange(tempPriceRange);
//     }, 600);
//     return () => clearTimeout(timeout);
//   }, [tempPriceRange, hasPriceInteracted]);

//   // ------------------ SYNC STATE → URL ------------------
//   useEffect(() => {
//     const params = new URLSearchParams();

//     if (debouncedSearch) params.set("search", debouncedSearch);
//     if (courseType) params.set("course_type", courseType);
//     if (categories) params.set("category_id", categories);
//     if (level) params.set("level", level);
//     if (budgetScale) params.set("budget_scale", budgetScale);
//     if (coursetrack) params.set("course_track", coursetrack);
//     if (deliverymode) params.set("delivery_mode", deliverymode);
//     if (batchstatus) params.set("batch_status", batchstatus);

//     if (hasPriceInteracted) {
//       params.set("min_price", String(debouncedPriceRange[0]));
//       params.set("max_price", String(debouncedPriceRange[1]));
//     }

//     const currentPageParam = new URLSearchParams(window.location.search).get(
//       "page",
//     );
//     if (currentPageParam) params.set("page", currentPageParam);

//     const newUrl = params.toString()
//       ? `${pathname}?${params.toString()}`
//       : pathname;
//     const currentUrl =
//       window.location.pathname + (window.location.search || "");
//     if (newUrl !== currentUrl) {
//       router.replace(newUrl, { scroll: false });
//     }
//   }, [
//     debouncedSearch,
//     courseType,
//     categories,
//     level,
//     budgetScale,
//     coursetrack,
//     deliverymode,
//     batchstatus,
//     debouncedPriceRange,
//     hasPriceInteracted,
//     pathname,
//     router,
//   ]);

//   // ------------------ HELPERS ------------------
//   const handleCheckboxChange = (
//     currentValue: string,
//     id: string,
//     checked: boolean,
//   ) => {
//     const arr = currentValue ? currentValue.split(",") : [];
//     return checked
//       ? [...arr, id].join(",")
//       : arr.filter((v) => v !== id).join(",");
//   };

//   const handleReset = () => {
//     router.replace(pathname, { scroll: false });
//   };

//   const currentCategoriesArray = categories.split(",").filter(Boolean);
//   const currentLevelsArray = level.split(",").filter(Boolean);

//   const hasActiveFilters =
//     search ||
//     courseType ||
//     categories ||
//     level ||
//     budgetScale ||
//     coursetrack ||
//     deliverymode ||
//     batchstatus ||
//     hasPriceInteracted;

//   // ------------------ JSX ------------------
//   return (
//     <div className="space-y-4">
//       <Accordion
//         type="multiple"
//         defaultValue={[
//           "search",
//           "course-type",
//           "course-category",
//           "course_track",
//           "price-range",
//           "level",
//           "budget-scale",
//         ]}
//       >
//         {/* SEARCH */}
//         <AccordionItem value="search">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Search by Course
//           </AccordionTrigger>
//           <AccordionContent>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
//               <Input
//                 placeholder="Search by course name..."
//                 className="pl-10"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* COURSE TYPE */}
//         <AccordionItem value="course-type">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Course Type ({filters.course_types?.length || 0})
//           </AccordionTrigger>
//           <AccordionContent className="space-y-3">
//             {filters.course_types?.map((item) => (
//               <div key={item.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`course-type-${item.id}`}
//                   checked={courseType === item.name}
//                   onCheckedChange={() =>
//                     setCourseType(courseType === item.name ? "" : item.name)
//                   }
//                 />
//                 <Label className="cursor-pointer"
//                   htmlFor={`course-type-${item.id}`}
//                   className="cursor-pointer"
//                 >
//                   {item.name}
//                 </Label>
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>

//         {/* CATEGORY */}
//         <AccordionItem value="course-category">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Course Category ({filters.categories?.length || 0})
//           </AccordionTrigger>
//           <AccordionContent className="space-y-3 max-h-60 overflow-y-auto">
//             {filters.categories?.map((item) => (
//               <div key={item.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`category-checkbox-${item.id}`}
//                   checked={currentCategoriesArray.includes(item.id.toString())}
//                   onCheckedChange={(checked) =>
//                     setCategories(
//                       handleCheckboxChange(
//                         categories,
//                         item.id.toString(),
//                         checked as boolean,
//                       ),
//                     )
//                   }
//                 />
//                 <Label className="cursor-pointer"
//                   htmlFor={`category-checkbox-${item.id}`}
//                   className="cursor-pointer"
//                 >
//                   {item.name}
//                 </Label>
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>

//         {/* COURSE TRACK */}
//         <AccordionItem value="course_track">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Course Track ({filters.course_track?.length || 0})
//           </AccordionTrigger>
//           <AccordionContent className="space-y-3">
//             {filters.course_track?.map((item) => (
//               <div key={item.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`course-track-${item.id}`}
//                   checked={coursetrack === item.id.toString()}
//                   onCheckedChange={() =>
//                     setCoursetrack(
//                       coursetrack === item.id.toString()
//                         ? ""
//                         : item.id.toString(),
//                     )
//                   }
//                 />
//                 <Label className="cursor-pointer"
//                   htmlFor={`course-track-${item.id}`}
//                   className="cursor-pointer"
//                 >
//                   {item.name}
//                 </Label>
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>

//         {/* PRICE */}
//         <AccordionItem value="price-range">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Price Range
//           </AccordionTrigger>
//           <AccordionContent>
//             <Slider
//               min={filters.price_range?.min || 0}
//               max={filters.price_range?.max || 100000}
//               step={100}
//               value={tempPriceRange}
//               onValueChange={(v) => {
//                 setTempPriceRange(v);
//                 setHasPriceInteracted(true);
//               }}
//               className="py-4"
//             />
//             <div className="flex justify-between text-sm">
//               <span>৳ {tempPriceRange[0]}</span>
//               <span>৳ {tempPriceRange[1]}</span>
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* LEVEL */}
//         <AccordionItem value="level">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Level ({filters.levels?.length || 0})
//           </AccordionTrigger>
//           <AccordionContent className="space-y-3">
//             {filters.levels?.map((item) => (
//               <div key={item.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`level-${item.id}`}
//                   checked={currentLevelsArray.includes(item.id.toString())}
//                   onCheckedChange={(checked) =>
//                     setLevel(
//                       handleCheckboxChange(
//                         level,
//                         item.id.toString(),
//                         checked as boolean,
//                       ),
//                     )
//                   }
//                 />
//                 <Label className="cursor-pointer" htmlFor={`level-${item.id}`} className="cursor-pointer">
//                   {item.name}
//                 </Label>
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>

//         {/* BUDGET SCALE */}
//         <AccordionItem value="budget-scale">
//           <AccordionTrigger className="text-base font-semibold text-secondary">
//             Budget Scale ({filters.budget_scale?.length || 0})
//           </AccordionTrigger>
//           <AccordionContent className="space-y-3">
//             {filters.budget_scale?.map((item) => (
//               <div key={item.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`budget-scale-${item.id}`}
//                   checked={budgetScale === item.id.toString()}
//                   onCheckedChange={() =>
//                     setBudgetScale(
//                       budgetScale === item.id.toString()
//                         ? ""
//                         : item.id.toString(),
//                     )
//                   }
//                 />
//                 <Label className="cursor-pointer"
//                   htmlFor={`budget-scale-${item.id}`}
//                   className="cursor-pointer"
//                 >
//                   {item.label}
//                 </Label>
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       {hasActiveFilters && (
//         <Button className="w-full" onClick={handleReset}>
//           <FilterX className="h-4 w-4 mr-2" />
//           Clear Query Filters
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CourseFilterSection;

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

interface CourseFilterSectionProps {
  filters: Filters;
}

const CourseFilterSection = ({ filters }: CourseFilterSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = (key: string) => searchParams.get(key) || "";

  // ------------------ STATES ------------------

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [courseType, setCourseType] = useState("");
  const [categories, setCategories] = useState("");
  const [level, setLevel] = useState("");
  const [budgetScale, setBudgetScale] = useState("");
  const [coursetrack, setCoursetrack] = useState("");
  const [deliverymode, setDeliverymode] = useState("");
  const [batchstatus, setBatchstatus] = useState("");

  const [hasPriceInteracted, setHasPriceInteracted] = useState(false);

  const [tempPriceRange, setTempPriceRange] = useState<number[]>([
    filters.price_range?.min || 0,
    filters.price_range?.max || 100000,
  ]);

  const [debouncedPriceRange, setDebouncedPriceRange] =
    useState(tempPriceRange);

  // ------------------ INIT FROM URL ------------------

  useEffect(() => {
    setSearch(getParam("search"));
    setCourseType(getParam("course_type"));
    setCategories(getParam("category_id"));
    setLevel(getParam("level"));
    setBudgetScale(getParam("budget_scale"));
    setCoursetrack(getParam("course_track"));
    setDeliverymode(getParam("delivery_mode"));
    setBatchstatus(getParam("batch_status"));

    const minPrice = getParam("min_price");
    const maxPrice = getParam("max_price");

    if (minPrice && maxPrice) {
      const min = Number(minPrice);
      const max = Number(maxPrice);

      if (!isNaN(min) && !isNaN(max)) {
        setTempPriceRange([min, max]);
        setHasPriceInteracted(true);
      }
    } else {
      setHasPriceInteracted(false);
      setTempPriceRange([
        filters.price_range?.min || 0,
        filters.price_range?.max || 100000,
      ]);
    }

    setDebouncedSearch(getParam("search"));
  }, [searchParams, filters.price_range]);

  // ------------------ SEARCH DEBOUNCE ------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timeout);
  }, [search]);

  // ------------------ STATE → URL SYNC ------------------

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (courseType) params.set("course_type", courseType);
    if (categories) params.set("category_id", categories);
    if (level) params.set("level", level);
    if (budgetScale) params.set("budget_scale", budgetScale);
    if (coursetrack) params.set("course_track", coursetrack);
    if (deliverymode) params.set("delivery_mode", deliverymode);
    if (batchstatus) params.set("batch_status", batchstatus);

    if (hasPriceInteracted) {
      params.set("min_price", String(debouncedPriceRange[0]));
      params.set("max_price", String(debouncedPriceRange[1]));
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    debouncedSearch,
    courseType,
    categories,
    level,
    budgetScale,
    coursetrack,
    deliverymode,
    batchstatus,
    debouncedPriceRange,
    hasPriceInteracted,
  ]);

  // ------------------ HELPERS ------------------

  const handleCheckboxChange = (
    currentValue: string,
    id: string,
    checked: boolean,
  ) => {
    const arr = currentValue ? currentValue.split(",") : [];

    return checked
      ? [...arr, id].join(",")
      : arr.filter((v) => v !== id).join(",");
  };

  const handleReset = () => {
    router.replace(pathname, { scroll: false });
  };

  const currentCategoriesArray = categories.split(",").filter(Boolean);
  const currentLevelsArray = level.split(",").filter(Boolean);

  const hasActiveFilters =
    search ||
    courseType ||
    categories ||
    level ||
    budgetScale ||
    coursetrack ||
    deliverymode ||
    batchstatus ||
    hasPriceInteracted;

  // ------------------ JSX ------------------

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
                    setCourseType(courseType === item.name ? "" : item.name)
                  }
                />
                <Label className="cursor-pointer" htmlFor={`course-type-${item.id}`}>{item.name}</Label>
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
                    setCategories(
                      handleCheckboxChange(
                        categories,
                        item.id.toString(),
                        checked as boolean,
                      ),
                    )
                  }
                />
                <Label className="cursor-pointer" htmlFor={`category-${item.id}`}>{item.name}</Label>
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
              min={filters.price_range?.min || 0}
              max={filters.price_range?.max || 100000}
              step={100}
              value={tempPriceRange}
              onValueChange={(v) => {
                setTempPriceRange(v);
              }}
              onValueCommit={(v) => {
                setTempPriceRange(v);
                setDebouncedPriceRange(v);
                setHasPriceInteracted(true);
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
                    setLevel(
                      handleCheckboxChange(
                        level,
                        item.id.toString(),
                        checked as boolean,
                      ),
                    )
                  }
                />
                <Label className="cursor-pointer" htmlFor={`level-${item.id}`}>{item.name}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasActiveFilters && (
        <Button className="w-full" onClick={handleReset}>
          <FilterX className="h-4 w-4 mr-2" />
          Clear Query Filters
        </Button>
      )}
    </div>
  );
};

export default CourseFilterSection;
