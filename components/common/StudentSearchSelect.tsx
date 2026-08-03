"use client";

import { useEffect, useState, useTransition, useMemo, useRef } from "react";
import {
    ComboboxRoot,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox";

import {
    getStudentsSimpleList,
    SimpleStudent,
} from "@/apiServices/studentService";

interface StudentSearchSelectProps {
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    /** Called with the full student object whenever selection changes */
    onStudentChange?: (student: SimpleStudent | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function StudentSearchSelect({
    value,
    onValueChange,
    onStudentChange,
    placeholder,
    disabled = false,
    className,
}: StudentSearchSelectProps) {
    const [students, setStudents] = useState<SimpleStudent[]>([]);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");
    // Keep a map of id → student for retained options
    const retainedRef = useRef<Map<string, SimpleStudent>>(new Map());

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            startTransition(async () => {
                try {
                    const res = await getStudentsSimpleList(searchTerm || undefined);
                    if (res?.success && res?.data) {
                        const list = res?.data?.students || [];
                        // Cache fetched students so selected one is never lost
                        list?.forEach((s) => retainedRef?.current?.set(String(s?.id), s));
                        setStudents(list);
                    } else {
                        setStudents([]);
                    }
                } catch (error: unknown) {
                    console.error("Failed to fetch students:", error);
                    setStudents([]);
                }
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Merge current list with cached selected student so it's always present
    const displayStudents = useMemo(() => {
        if (!value) return students;
        const alreadyInList = students?.some((s) => String(s?.id) === value);
        if (alreadyInList) return students;
        const cached = retainedRef?.current?.get(value);
        return cached ? [cached, ...students] : students;
    }, [students, value]);

    const handleValueChange = (newValue: string | null) => {
        onValueChange?.(newValue);
        const found = newValue
            ? retainedRef?.current?.get(newValue) ??
            students?.find((s) => String(s?.id) === newValue) ??
            null
            : null;
        onStudentChange?.(found);
    };

    return (
        <ComboboxRoot
            disabled={disabled}
            multiple={false}
            value={value || ""}
            onValueChange={handleValueChange}
            onInputValueChange={(val) => setSearchTerm(val)}
            itemToStringLabel={(val) => {
                const s =
                    retainedRef?.current?.get(val) ??
                    students?.find((s) => String(s?.id) === val);
                return s ? `${s?.name}${s?.phone ? ` — ${s?.phone}` : ""}` : "";
            }}
        >
            <ComboboxInput
                placeholder={
                    isPending
                        ? "Loading students..."
                        : (placeholder || "Search & select student")
                }
                showClear={!!value}
                showTrigger={true}
                className={className}
            />
            <ComboboxContent>
                <ComboboxList className="m-3 px-3 py-1.5 space-y-1">
                    {displayStudents?.map((student) => (
                        <ComboboxItem
                            key={student?.id}
                            value={String(student?.id)}
                            className="flex-col items-start gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 cursor-pointer hover:bg-accent hover:border-accent-foreground/10 data-highlighted:bg-accent data-highlighted:border-accent-foreground/10 transition-colors"
                        >
                            {/* Row 1: name + badges */}
                            <div className="flex items-center gap-2 w-full flex-wrap">
                                <span className="font-semibold text-sm text-foreground leading-tight">
                                    {student?.name}
                                </span>
                                {student?.is_govt === 1 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 leading-none shrink-0">
                                        Govt
                                    </span>
                                )}
                                {student?.is_paid === 1 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-600 border border-green-200 leading-none shrink-0">
                                        Paid
                                    </span>
                                )}
                            </div>

                            {/* Row 2: phone + email */}
                            {(student?.phone || (student?.email && !student?.email?.includes("@no-email"))) && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 w-full">
                                    {student?.phone && (
                                        <span className="shrink-0">
                                            <span className="font-medium text-slate-700">Phone:</span>{" "}
                                            {student?.phone}
                                        </span>
                                    )}
                                    {student?.email && !student?.email?.includes("@no-email") && (
                                        <span className="truncate min-w-0">
                                            <span className="font-medium text-slate-700">Email:</span>{" "}
                                            {student?.email}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Row 3: course · batch + branch (only if present) */}
                            {(student?.courses || student?.branches) && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 w-full">
                                    {student?.courses && (
                                        <span className="truncate min-w-0">
                                            <span className="font-medium text-slate-700">Course:</span>{" "}
                                            {student?.courses}
                                            {student.batch && (
                                                <>
                                                    {" · "}
                                                    <span className="font-medium text-slate-700">Batch:</span>{" "}
                                                    {student?.batch}
                                                </>
                                            )}
                                        </span>
                                    )}
                                    {student?.branches && (
                                        <span className="shrink-0">
                                            <span className="font-medium text-slate-700">Branch:</span>{" "}
                                            {student?.branches}
                                        </span>
                                    )}
                                </div>
                            )}
                        </ComboboxItem>
                    ))}

                    {displayStudents?.length === 0 && (
                        <ComboboxEmpty>
                            {isPending ? "Loading..." : "No students found"}
                        </ComboboxEmpty>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </ComboboxRoot>
    );
}
