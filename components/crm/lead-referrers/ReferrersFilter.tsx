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
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange";

interface FilterFormValues {
    search?: string;
    status?: string;
    sort_order?: string;
    branch_name?: string;
}

interface ReferrersFilterProps {
    branches?: Branch[];
}

export default function ReferrersFilter({ branches = [] }: ReferrersFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || "",
                sort_order: searchParams.get("sort_order") || "",
                branch_name: searchParams.get("branch_name") || "",
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
            branch_name: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentBranchName = searchParams.get("branch_name") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentStatus !== "" ||
        currentSortOrder !== "" ||
        currentBranchName !== "" ||
        !!searchParams.get("date_from") ||
        !!searchParams.get("date_to");

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {/* Search */}
                <div className="relative md:col-span-2 xl:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search referrers (name, email, institute_name...)"
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

                {/* Date Picker Range */}
                <div className="md:col-span-2 xl:col-span-2">
                    <DatePickerWithRange />
                </div>

                {/* Branch Selection */}
                <Controller
                    name="branch_name"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("branch_name")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch Name" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches?.length > 0 ? (
                                    branches.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={branch.name}
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-branch" disabled>
                                        No branches available
                                    </SelectItem>
                                )}
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
            </div>
        </div>
    );
}
