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
import { CRMCategory } from "@/apiServices/crmCategoryService";

interface FilterFormValues {
    search?: string;
    sort_order?: string;
    status?: string;
    branch_id?: string;
    category_id?: string;
    source?: string;
}

interface CRMLeadsFilterProps {
    branches: Branch[];
    categories?: CRMCategory[];
}

export default function CRMLeadsFilter({
    branches,
    categories,
}: CRMLeadsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                sort_order: searchParams.get("sort_order") || "",
                status: searchParams.get("status") || "",
                branch_id: searchParams.get("branch_id") || "",
                category_id: searchParams.get("category_id") || "",
                source: searchParams.get("source") || "",
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
            sort_order: "",
            status: "",
            branch_id: "",
            category_id: "",
            source: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentCategoryId = searchParams.get("category_id") || "";
    const currentSource = searchParams.get("source") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentSortOrder !== "" ||
        currentStatus !== "" ||
        currentBranchId !== "" ||
        currentCategoryId !== "" ||
        currentSource !== "";

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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {/* Search */}
                <div className="relative col-span-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, phone, referrer, course, user..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

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
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("status")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">New</SelectItem>
                                <SelectItem value="2">Busy</SelectItem>
                                <SelectItem value="3">Interested</SelectItem>
                                <SelectItem value="4">Follow Up</SelectItem>
                                <SelectItem value="5">Enrolled</SelectItem>
                                <SelectItem value="6">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />



                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("branch_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Category */}
                <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("category_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Lead Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Source */}
                <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("source")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Manual</SelectItem>
                                <SelectItem value="2">Facebook</SelectItem>
                                <SelectItem value="3">Website</SelectItem>
                                <SelectItem value="4">API</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />


            </div>
        </div>
    );
}
