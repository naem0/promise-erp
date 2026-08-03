"use client";

import { useEffect, useState, useTransition, useMemo, useRef } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
    getPaymentMethodNames,
    PaymentMethod,
} from "@/apiServices/paymentMethodService";

interface PaymentMethodSearchSelectProps {
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function PaymentMethodSearchSelect({
    value,
    onValueChange,
    placeholder,
    disabled = false,
    className,
}: PaymentMethodSearchSelectProps) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");
    const retainedRef = useRef<Map<string, PaymentMethod>>(new Map());

    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        label: string;
    } | null>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            startTransition(async () => {
                try {
                    const res = await getPaymentMethodNames(searchTerm || undefined);
                    if (res?.success && Array?.isArray(res?.data)) {
                        const list = res?.data;
                        list?.forEach((m) => retainedRef?.current?.set(String(m?.id), m));
                        setMethods(list);
                    } else {
                        setMethods([]);
                    }
                } catch (error: unknown) {
                    console.error("Failed to fetch payment methods:", error);
                    setMethods([]);
                }
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const options = useMemo(() => {
        return methods?.map((m) => ({
            value: String(m?.id),
            label: m?.name?.trim(),
        }));
    }, [methods]);

    // Retain selected option so it stays visible while searching
    useEffect(() => {
        if (value) {
            const found = options?.find((o) => o?.value === value);
            if (found) setSelectedOption(found);
        } else {
            setSelectedOption(null);
        }
    }, [value, options]);

    const finalOptions = useMemo(() => {
        if (selectedOption && !options?.some((o) => o?.value === selectedOption?.value)) {
            return [selectedOption, ...options];
        }
        return options;
    }, [options, selectedOption]);

    return (
        <Combobox
            options={finalOptions}
            value={value || ""}
            onValueChange={onValueChange}
            onInputValueChange={(val) => setSearchTerm(val)}
            placeholder={
                isPending
                    ? "Loading..."
                    : (placeholder || "Search & select payment method")
            }
            searchPlaceholder="Search payment method..."
            emptyMessage={isPending ? "Loading..." : "No payment methods found"}
            disabled={disabled}
            disableFilter={true}
            className={className}
        />
    );
}
