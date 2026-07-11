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
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";
import PerPageSelect from "@/components/common/PerPageSelect";

interface FilterFormValues {
  search?: string;
  type?: string;
  status?: string;
  sort_order?: string;
}

const SECTION_TYPES = [
  { value: "none",                    label: "None" },
  { value: "course_category",         label: "Course Category" },
  { value: "service",                 label: "Service" },
  { value: "popular_course",          label: "Popular Course" },
  { value: "govt_course",             label: "Government Course" },
  { value: "opportunity",             label: "Opportunity" },
  { value: "trainer",                 label: "Trainer" },
  { value: "video_gallery",           label: "Video Gallery" },
  { value: "blog",                    label: "Blog" },
  { value: "success_story",           label: "Success Story" },
  { value: "news_feed",               label: "News Feed" },
  { value: "partner",                 label: "Partner" },
  { value: "news_letter",             label: "News Letter" },
  { value: "branch",                  label: "Branch" },
  { value: "why_choose_us",           label: "Why Choose Us" },
  { value: "mission",                 label: "Mission" },
  { value: "vision",                  label: "Vision" },
  { value: "value",                   label: "Value" },
  { value: "about_banner",            label: "About Banner" },
  { value: "blog_banner",             label: "Blog Banner" },
  { value: "blog_details_banner",     label: "Blog Details Banner" },
  { value: "blog_category_banner",    label: "Blog Category Banner" },
  { value: "contact_banner",          label: "Contact Banner" },
  { value: "image_gallery_banner",    label: "Image Gallery Banner" },
  { value: "job_banner",              label: "Job Banner" },
  { value: "job_banner_details",      label: "Job Banner Details" },
  { value: "our_officers_banner",     label: "Our Officers Banner" },
  { value: "privacy_banner",          label: "Privacy Banner" },
  { value: "service_banner",          label: "Service Banner" },
  { value: "success_story_banner",    label: "Success Story Banner" },
  { value: "terms_banner",            label: "Terms Banner" },
  { value: "trainer_banner",          label: "Trainer Banner" },
  { value: "video_gallery_banner",    label: "Video Gallery Banner" },
  { value: "jubo_banner",             label: "Jubo Banner" },
  { value: "jubo_details_banner",     label: "Jubo Details Banner" },
];

export default function CommonSectionsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search:     searchParams.get("search")     || "",
        type:       searchParams.get("type")       || "",
        status:     searchParams.get("status")     || "",
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
      search:     "",
      type:       "",
      status:     "",
      sort_order: "",
    });
    router.replace(pathname, { scroll: false });
  };

  const currentSearch    = searchParams.get("search")     || "";
  const currentType      = searchParams.get("type")       || "";
  const currentStatus    = searchParams.get("status")     || "";
  const currentSortOrder = searchParams.get("sort_order") || "";
  const currentPerPage   = searchParams.get("per_page")   || "";

  const hasActiveFilters =
    currentSearch    !== "" ||
    currentType      !== "" ||
    currentStatus    !== "" ||
    currentSortOrder !== "" ||
    currentPerPage   !== "";

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search common sections..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Type — searchable combobox */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Combobox
              options={SECTION_TYPES}
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value ?? "");
                handleSelectChange("type")(value ?? "");
              }}
              placeholder="Type"
              searchPlaceholder="Search type..."
              className="w-full"
            />
          )}
        />

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

        {/* Per Page Select */}
        <div className="flex items-center justify-start md:col-span-1">
          <PerPageSelect className="w-full" />
        </div>
      </div>
    </div>
  );
}
