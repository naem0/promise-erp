"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PerPageSelectProps {
  className?: string;
}

export default function PerPageSelect({
  className = "",
}: PerPageSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") {
      params.set("per_page", value);
    } else {
      params.delete("per_page");
    }
    params.delete("page"); // Reset page to 1 on page size change

    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const currentValue = searchParams.get("per_page") || "";

  return (
    <div className={className}>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-background text-slate-700">
          <SelectValue placeholder="Show Per Page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="15">15 Per Page</SelectItem>
          <SelectItem value="30">30 Per Page</SelectItem>
          <SelectItem value="50">50 Per Page</SelectItem>
          <SelectItem value="100">100 Per Page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
