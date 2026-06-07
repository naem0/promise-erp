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
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange";
import { PaymentMethod } from "@/apiServices/studentDashboardService";

interface FilterFormValues {
    search?: string;
    status?: string;
    payment_method?: string;
    branch_id?: string;
    enrollment_id?: string;
}

interface InvoicesFilterProps {
    paymentMethods?: PaymentMethod[];
}

export default function InvoicesFilter({ paymentMethods = [] }: InvoicesFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { register, control, reset, watch, setValue } =
        useForm<FilterFormValues>({
            defaultValues: {
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || "",
                payment_method: searchParams.get("payment_method") || "",
                branch_id: searchParams.get("branch_id") || "",
                enrollment_id: searchParams.get("enrollment_id") || "",
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
                    if (value !== undefined && value !== null && value !== "") {
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
            payment_method: "",
            branch_id: "",
            enrollment_id: "",
        });
        
        // Also clear date picker params from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("status");
        params.delete("payment_method");
        params.delete("branch_id");
        params.delete("enrollment_id");
        params.delete("date_from");
        params.delete("date_to");
        params.delete("page");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentPaymentMethod = searchParams.get("payment_method") || "";
    const currentBranchId = searchParams.get("branch_id") || "";
    const currentEnrollmentId = searchParams.get("enrollment_id") || "";
    const currentDateFrom = searchParams.get("date_from") || "";
    const currentDateTo = searchParams.get("date_to") || "";

    const hasActiveFilters =
        currentSearch !== "" ||
        currentStatus !== "" ||
        currentPaymentMethod !== "" ||
        currentBranchId !== "" ||
        currentEnrollmentId !== "" ||
        currentDateFrom !== "" ||
        currentDateTo !== "";

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
                        className="flex items-center gap-2 cursor-pointer animate-in fade-in duration-200"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {/* Search */}
                <div className="relative col-span-1 sm:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by invoice number, student, batch..."
                        className="pl-10 h-9"
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
                            onValueChange={(val) => {
                                field.onChange(val);
                                handleSelectChange("branch_id")(val || "");
                            }}
                            placeholder="Select Branch"
                            className="h-9"
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
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Invoice Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Pending</SelectItem>
                                <SelectItem value="1">Paid</SelectItem>
                                <SelectItem value="2">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Payment Method */}
                <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleSelectChange("payment_method")(value);
                            }}
                        >
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods?.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <SelectItem
                                            key={method.id}
                                            value={String(method.id)}
                                        >
                                            {method.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-methods" disabled>
                                        No payment methods available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />


                {/* Invoice ID */}
                <div>
                    <Input
                        placeholder="Invoice ID"
                        type="text"
                        className="h-9"
                        {...register("enrollment_id")}
                    />
                </div>

                {/* Date Picker */}
                <div className="col-span-1 sm:col-span-2">
                    <DatePickerWithRange />
                </div>


            </div>
        </div>
    );
}
