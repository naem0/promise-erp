"use client";

import { useEffect, useState, useTransition, useMemo, useRef } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
    getEarningSitesSimpleList,
    EarningSite,
} from "@/apiServices/earningSiteService";

interface EarningSiteSearchSelectProps {
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function EarningSiteSearchSelect({
    value,
    onValueChange,
    placeholder,
    disabled = false,
    className,
}: EarningSiteSearchSelectProps) {
    const [sites, setSites] = useState<EarningSite[]>([]);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");
    const retainedRef = useRef<Map<string, EarningSite>>(new Map());

    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        label: string;
    } | null>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            startTransition(async () => {
                try {
                    const res = await getEarningSitesSimpleList(searchTerm || undefined);
                    if (res?.success && res?.data) {
                        const list = res?.data  ?.earning_sites || [];
                        list?.forEach((s) => retainedRef?.current?.set(String(s.id), s));
                        setSites(list);
                    } else {
                        setSites([]);
                    }
                } catch (error: unknown) {
                    console.error("Failed to fetch earning sites:", error);
                    setSites([]);
                }
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const options = useMemo(() => {
        return sites?.map((site) => ({
            value: String(site?.id),
            label: site?.title?.trim(),
        }));
    }, [sites]);

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
                    : (placeholder || "Search & select earning site")
            }
            searchPlaceholder="Search earning site..."
            emptyMessage={isPending ? "Loading..." : "No earning sites found"}
            disabled={disabled}
            disableFilter={true}
            className={className}
        />
    );
}
