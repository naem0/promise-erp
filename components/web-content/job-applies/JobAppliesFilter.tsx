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
import { useDebounce } from "@/hooks/useDebounce";

interface FilterFormValues {
    search?: string;
    sort_order?: string;
    status?: string;
    career_id?: string;
    per_page?: string;
}

interface JobAppliesFilterProps {
    careers: { id: number; title: string }[];
}

export default function JobAppliesFilter({ careers }: JobAppliesFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                sort_order: searchParams.get("sort_order") || "",
                status: searchParams.get("status") || "",
                career_id: searchParams.get("career_id") || "",
                per_page: searchParams.get("per_page") || "",
            },
        });

    const watchedValues = watch();
    const debouncedValues = useDebounce(watchedValues, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");

        Object.entries(debouncedValues).forEach(([key, value]) => {
            if (value && value !== "") {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        const newQuery = params.toString();
        const currentQuery = searchParams.toString();

        if (newQuery !== currentQuery) {
            const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [debouncedValues, pathname, router, searchParams]);

    const handleSelectChange =
        (name: keyof FilterFormValues) => (value: string) => {
            setValue(name, value);
        };

    const handleReset = () => {
        reset({
            search: "",
            sort_order: "",
            status: "",
            career_id: "",
            per_page: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentCareerId = searchParams.get("career_id") || "";
    const currentPerPage = searchParams.get("per_page") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentSortOrder !== "" ||
        currentStatus !== "" ||
        currentCareerId !== "" ||
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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {/* Search */}
                <div className="col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, phone..."
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
                                <SelectItem value="0">Pending</SelectItem>
                                <SelectItem value="1">Reviewed</SelectItem>
                                <SelectItem value="2">Shortlisted</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Career */}
                <Controller
                    name="career_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("career_id")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Job Position" />
                            </SelectTrigger>
                            <SelectContent>
                                {careers.map((career) => (
                                    <SelectItem key={career.id} value={String(career.id)}>
                                        {career.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Per Page */}
                <Controller
                    name="per_page"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("per_page")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Show Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 Per Page</SelectItem>
                                <SelectItem value="30">30 Per Page</SelectItem>
                                <SelectItem value="50">50 Per Page</SelectItem>
                                <SelectItem value="100">100 Per Page</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
