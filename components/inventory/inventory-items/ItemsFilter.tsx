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
import { Combobox } from "@/components/ui/combobox";
import { ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { Brand } from "@/apiServices/inventoryBrandsService";
import { Room } from "@/apiServices/inventoryRoomsService";
import PerPageSelect from "@/components/common/PerPageSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import BrandSearchSelect from "@/components/common/BrandSearchSelect";
import InventoryCategorySearchSelect from "@/components/common/InventoryCategorySearchSelect";

interface FilterFormValues {
    search?: string;
    status?: string;
    sort_order?: string;
    category_id?: string;
    brand_id?: string;
    room_id?: string;
    branch_id?: string;
}

interface ItemsFilterProps {
    categories?: ProductCategory[];
    brands?: Brand[];
    rooms?: Room[];
}

export default function ItemsFilter({ categories = [], brands = [], rooms = [] }: ItemsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || "",
                sort_order: searchParams.get("sort_order") || "",
                category_id: searchParams.get("category_id") || "",
                brand_id: searchParams.get("brand_id") || "",
                room_id: searchParams.get("room_id") || "",
                branch_id: searchParams.get("branch_id") || "",
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
            search: "",
            status: "",
            sort_order: "",
            category_id: "",
            brand_id: "",
            room_id: "",
            branch_id: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentCategoryId = searchParams.get("category_id") || "";
    const currentBrandId = searchParams.get("brand_id") || "";
    const currentRoomId = searchParams.get("room_id") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentPerPage = searchParams.get("per_page") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentStatus !== "" ||
        currentSortOrder !== "" ||
        currentCategoryId !== "" ||
        currentBrandId !== "" ||
        currentRoomId !== "" ||
        currentBranchId !== "" ||
        currentPerPage !== "";

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                {/* Search */}
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, barcode, model..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <BranchSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("branch_id")(value || "");
                            }}
                            className="w-full"
                        />
                    )}
                />

                {/* Category */}
                <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                        <InventoryCategorySearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("category_id")(value || "");
                            }}
                            className="w-full"
                        />
                    )}
                />

                {/* Brand */}
                <Controller
                    name="brand_id"
                    control={control}
                    render={({ field }) => (
                        <BrandSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("brand_id")(value || "");
                            }}
                            className="w-full"
                        />
                    )}
                />

                {/* Room */}
                <Controller
                    name="room_id"
                    control={control}
                    render={({ field }) => (
                        <Combobox
                            options={rooms?.map(room => ({ value: room.id.toString(), label: room.name })) || []}
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("room_id")(value || "");
                            }}
                            placeholder="Select Room"
                            searchPlaceholder="Search room..."
                            emptyMessage="No rooms found"
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
