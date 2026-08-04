"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PerPageSelectProps<TFieldValues extends FieldValues = FieldValues> {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options?: (string | number)[];
  placeholder?: string;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
}

export default function PerPageSelect<
  TFieldValues extends FieldValues = FieldValues
>({
  className = "",
  value,
  onValueChange,
  options = ["15", "30", "50", "100"],
  placeholder = "Show Per Page",
  control,
  name,
}: PerPageSelectProps<TFieldValues>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (val: string, fieldOnChange?: (value: string) => void) => {
    if (fieldOnChange) {
      fieldOnChange(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "") {
      params.set("per_page", val);
    } else {
      params.delete("per_page");
    }
    params.delete("page"); // Reset page to 1 on page size change

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const renderSelect = (
    currentVal?: string,
    onChangeHandler?: (val: string) => void
  ) => {
    const selectedValue =
      currentVal !== undefined && currentVal !== ""
        ? String(currentVal)
        : searchParams.get("per_page") || "";

    return (
      <div className={className}>
        <Select
          value={selectedValue}
          onValueChange={(val) => handleSelect(val, onChangeHandler)}
        >
          <SelectTrigger className="w-full bg-background text-slate-700">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => {
              const strOpt = String(opt);
              return (
                <SelectItem key={strOpt} value={strOpt}>
                  {strOpt} Per Page
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderSelect(field.value, field.onChange)}
      />
    );
  }

  return renderSelect(value);
}
