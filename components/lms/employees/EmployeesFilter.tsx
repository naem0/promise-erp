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

import RoleSearchSelect from "@/components/common/RoleSearchSelect";
import DesignationSearchSelect from "@/components/common/DesignationSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import DepartmentSearchSelect from "@/components/common/DepartmentSearchSelect";

interface FilterFormValues {
    search?: string;
    sort_order?: string;
    employment_type?: string;
    branch_id?: string;
    department_id?: string;
    role_id?: string;
    designation_id?: string;
    blood_group?: string;
    per_page?: string;
}

export default function EmployeesFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                sort_order: searchParams.get("sort_order") || "",
                employment_type: searchParams.get("employment_type") || "",
                branch_id: searchParams.get("branch_id") || "",
                department_id: searchParams.get("department_id") || "",
                role_id: searchParams.get("role_id") || "",
                designation_id: searchParams.get("designation_id") || "",
                blood_group: searchParams.get("blood_group") || "",
                per_page: searchParams.get("per_page") || "",
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
            employment_type: "",
            branch_id: "",
            department_id: "",
            role_id: "",
            designation_id: "",
            blood_group: "",
            per_page: "",
        });
        router.replace(pathname, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentSortOrder = searchParams.get("sort_order") || "";
    const currentEmploymentType = searchParams.get("employment_type") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentDepartmentId = searchParams.get("department_id") || "";
    const currentRoleId = searchParams.get("role_id") || "";
    const currentDesignationId = searchParams.get("designation_id") || "";
    const currentBloodGroup = searchParams.get("blood_group") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentSortOrder !== "" ||
        currentEmploymentType !== "" ||
        currentBranchId !== "" ||
        currentDepartmentId !== "" ||
        currentRoleId !== "" ||
        currentDesignationId !== "" ||
        currentBloodGroup !== "";

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
                <div className="relative col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="name, email, phone,Employee Id, designation..."
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

                {/* Employment Type */}
                <Controller
                    name="employment_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("employment_type")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Probation</SelectItem>
                                <SelectItem value="1">Full-time</SelectItem>
                                <SelectItem value="2">Part-time</SelectItem>
                                <SelectItem value="3">Contractual</SelectItem>
                            </SelectContent>
                        </Select>
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
                                field.onChange(value ?? "");
                                handleSelectChange("branch_id")(value ?? "");
                            }}
                            placeholder="Branch"
                        />
                    )}
                />

                {/* Department */}
                <Controller
                    name="department_id"
                    control={control}
                    render={({ field }) => (
                        <DepartmentSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value ?? "");
                                handleSelectChange("department_id")(value ?? "");
                            }}
                            placeholder="Department"
                        />
                    )}
                />

                {/* Role */}
                <Controller
                    name="role_id"
                    control={control}
                    render={({ field }) => (
                        <RoleSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value ?? "");
                                handleSelectChange("role_id")(value ?? "");
                            }}
                            placeholder="Role"
                        />
                    )}
                />

                {/* Designation */}
                <Controller
                    name="designation_id"
                    control={control}
                    render={({ field }) => (
                        <DesignationSearchSelect
                            value={field.value || ""}
                            onValueChange={(value) => {
                                field.onChange(value ?? "");
                                handleSelectChange("designation_id")(value ?? "");
                            }}
                            placeholder="Designation"
                        />
                    )}
                />

                {/* Blood Group */}
                <Controller
                    name="blood_group"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("blood_group")(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Blood Group" />
                            </SelectTrigger>
                            <SelectContent>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                    <SelectItem key={bg} value={bg}>
                                        {bg}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Show Per Page */}
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
