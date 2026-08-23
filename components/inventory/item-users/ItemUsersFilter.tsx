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
import PerPageSelect from "@/components/common/PerPageSelect";
import EmployeeSearchSelect from "@/components/common/EmployeeSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import RoomSearchSelect from "@/components/common/RoomSearchSelect";
import ProductSearchSelect from "@/components/common/ProductSearchSelect";
import GroupItemSearchSelect from "@/components/common/GroupItemSearchSelect";

interface FilterFormValues {
  search?: string;
  user_id?: string;
  branch_id?: string;
  room_id?: string;
  product_id?: string;
  group_item_id?: string;
  status?: string;
}

export default function ItemUsersFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, control, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: {
        search: searchParams.get("search") || "",
        user_id: searchParams.get("user_id") || "",
        branch_id: searchParams.get("branch_id") || "",
        room_id: searchParams.get("room_id") || "",
        product_id: searchParams.get("product_id") || "",
        group_item_id: searchParams.get("group_item_id") || "",
        status: searchParams.get("status") || "",
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

  const handleReset = () => {
    reset({
      search: "",
      user_id: "",
      branch_id: "",
      room_id: "",
      product_id: "",
      group_item_id: "",
      status: "",
    });
    router.replace(pathname, { scroll: false });
  };

  const currentSearch = searchParams.get("search") || "";
  const currentUserId = searchParams.get("user_id") || "";
  const currentBranchId = searchParams.get("branch_id") || "";
  const currentRoomId = searchParams.get("room_id") || "";
  const currentProductId = searchParams.get("product_id") || "";
  const currentGroupItemId = searchParams.get("group_item_id") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentPerPage = searchParams.get("per_page") || "";

  const hasActiveFilters =
    currentSearch !== "" ||
    currentUserId !== "" ||
    currentBranchId !== "" ||
    currentRoomId !== "" ||
    currentProductId !== "" ||
    currentGroupItemId !== "" ||
    currentStatus !== "" ||
    currentPerPage !== "";

  return (
    <div className="p-5 mb-6 border border-slate-200/80 rounded-2xl bg-white shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Filters</h3>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <FilterX className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by employee name, email, or item name..."
            className="pl-9 bg-white"
            {...register("search")}
          />
        </div>

        {/* Employee */}
        <Controller
          name="user_id"
          control={control}
          render={({ field }) => (
            <EmployeeSearchSelect
              value={field.value || ""}
              branchId={watchedValues.branch_id || undefined}
              onValueChange={(value) => {
                field.onChange(value || "");
              }}
              placeholder="Select Employee"
              className="w-full"
            />
          )}
        />

        {/* Product (Item) */}
        <Controller
          name="product_id"
          control={control}
          render={({ field }) => (
            <ProductSearchSelect
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value || "");
              }}
              placeholder="Select item"
              className="w-full"
            />
          )}
        />

        {/* Branch */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <BranchSearchSelect
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value || "");
                if (!value) {
                  setValue("room_id", "");
                }
              }}
              placeholder="Select Branch"
              className="w-full"
            />
          )}
        />

        {/* Room */}
        <Controller
          name="room_id"
          control={control}
          render={({ field }) => (
            <RoomSearchSelect
              value={field.value || ""}
              branchId={watchedValues.branch_id || undefined}
              onValueChange={(value) => {
                field.onChange(value || "");
              }}
              placeholder="Select Room"
              className="w-full"
            />
          )}
        />

        {/* Group Item */}
        <Controller
          name="group_item_id"
          control={control}
          render={({ field }) => (
            <GroupItemSearchSelect
              value={field.value || ""}
              onValueChange={(value) => {
                field.onChange(value || "");
              }}
              placeholder="Select Group Item"
              className="w-full"
            />
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("status", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
                <SelectItem value="2">Repair</SelectItem>
                <SelectItem value="3">Damaged</SelectItem>
                <SelectItem value="4">Transferred</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Per Page Select */}
        <div className="flex items-center justify-start sm:col-span-2 md:col-span-1 lg:col-span-1">
          <PerPageSelect className="w-full" />
        </div>
      </div>
    </div>
  );
}
