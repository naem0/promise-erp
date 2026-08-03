"use client";

import { useEffect, useState, useTransition, useMemo, useRef } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
    getPublicCareerCategories,
    CareerCategory,
} from "@/apiServices/careerCategoryService";

interface CareerCategorySearchSelectProps {
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function CareerCategorySearchSelect({
    value,
    onValueChange,
    placeholder,
    disabled = false,
    className,
}: CareerCategorySearchSelectProps) {
    const [categories, setCategories] = useState<CareerCategory[]>([]);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");
    const retainedRef = useRef<Map<string, CareerCategory>>(new Map());

    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        label: string;
    } | null>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            startTransition(async () => {
                try {
                    const res = await getPublicCareerCategories(searchTerm || undefined);
                    if (res?.success && res?.data) {
                        const list = res?.data?.career_categories || [];
                        list?.forEach((c) => retainedRef?.current?.set(String(c.id), c));
                        setCategories(list);
                    } else {
                        setCategories([]);
                    }
                } catch (error: unknown) {
                    console.error("Failed to fetch career categories:", error);
                    setCategories([]);
                }
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const options = useMemo(() => {
        return categories?.map((c) => ({
            value: String(c.id),
            label: c.name.trim(),
        }));
    }, [categories]);

    // Retain selected option so it stays visible while searching
    useEffect(() => {
        if (value) {
            const found = options?.find((o) => o.value === value);
            if (found) setSelectedOption(found);
        } else {
            setSelectedOption(null);
        }
    }, [value, options]);

    const finalOptions = useMemo(() => {
        if (selectedOption && !options?.some((o) => o.value === selectedOption.value)) {
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
                    : (placeholder || "Search & select career category")
            }
            searchPlaceholder="Search career category..."
            emptyMessage={isPending ? "Loading..." : "No career categories found"}
            disabled={disabled}
            disableFilter={true}
            className={className}
        />
    );
}
