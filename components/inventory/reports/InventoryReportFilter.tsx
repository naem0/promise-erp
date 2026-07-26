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
import { Search, FilterX, X } from "lucide-react";
import { ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { Room } from "@/apiServices/inventoryRoomsService";

interface FilterFormValues {
  search?: string;
  category_id?: string;
  room_id?: string;
  is_store?: string;
}

interface InventoryReportFilterProps {
  categories?: ProductCategory[];
  rooms?: Room[];
}

export default function InventoryReportFilter({
  categories = [],
  rooms = [],
}: InventoryReportFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      category_id: searchParams.get("category_id") || "",
      room_id: searchParams.get("room_id") || "",
      is_store: searchParams.get("is_store") || "",
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
          if (value && value !== "" && value !== "ALL") {
            params.set(key, String(value));
          } else {
            params.delete(key);
          }
        });

        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [JSON.stringify(watchedValues), router, pathname, searchParams]);

  const handleClearFilters = () => {
    reset({
      search: "",
      category_id: "",
      room_id: "",
      is_store: "",
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("category_id");
    params.delete("room_id");
    params.delete("is_store");
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isFilterActive =
    !!watchedValues.search ||
    !!watchedValues.category_id ||
    !!watchedValues.room_id ||
    !!watchedValues.is_store;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5 print:hidden">
      {/* Header with Title and Clear Filters button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 min-h-[32px]">
        <h2 className="text-sm font-semibold text-slate-800">
          Category-wise Item Register & Filters
        </h2>
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2.5 flex items-center gap-1.5 font-medium transition-colors"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Search */}
        <div className="space-y-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              {...register("search")}
              placeholder="Search item, barcode, brand..."
              className="pl-9 pr-8 h-9 text-sm bg-slate-50 focus:bg-white border-slate-200"
            />
            {watchedValues.search && (
              <button
                type="button"
                onClick={() => setValue("search", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "ALL"}
                onValueChange={(val) => field.onChange(val === "ALL" ? "" : val)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-slate-50 focus:bg-white border-slate-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories && categories?.length > 0 ? (
                    categories?.map((cat) => (
                      <SelectItem key={cat?.id} value={String(cat?.id)}>
                        {cat?.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 text-center">
                      No categories available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Room Filter */}
        <div className="space-y-1">
          <Controller
            name="room_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "ALL"}
                onValueChange={(val) => field.onChange(val === "ALL" ? "" : val)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-slate-50 focus:bg-white border-slate-200">
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Rooms</SelectItem>
                  {rooms && rooms?.length > 0 ? (
                    rooms?.map((room) => (
                      <SelectItem key={room?.id} value={String(room?.id)}>
                        {room?.name} {room?.room_no ? `(${room?.room_no})` : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 text-center">
                      No rooms available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Is Store Filter */}
        <div className="space-y-1">
          <Controller
            name="is_store"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "ALL"}
                onValueChange={(val) => field.onChange(val === "ALL" ? "" : val)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-slate-50 focus:bg-white border-slate-200">
                  <SelectValue placeholder="All Storage Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Storage Types</SelectItem>
                  <SelectItem value="0">Branch Room</SelectItem>
                  <SelectItem value="1">Store Room</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
