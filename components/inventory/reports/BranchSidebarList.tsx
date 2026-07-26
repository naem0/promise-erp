"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { InventoryReportBranch } from "@/apiServices/inventoryreportService";
import { Input } from "@/components/ui/input";
import { Search, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BranchSidebarListProps {
  branches: InventoryReportBranch[];
}

export default function BranchSidebarList({ branches }: BranchSidebarListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");

  const currentBranchId =
    searchParams.get("branch_id") ||
    (branches.length > 0 ? String(branches[0].id) : "");

  const filteredBranches = branches.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      (b.location && b.location.toLowerCase().includes(term)) ||
      (b.code && b.code.toLowerCase().includes(term))
    );
  });

  const handleSelectBranch = (branchId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("branch_id", String(branchId));
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full md:w-72 lg:w-80 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-64 md:max-h-none md:h-[calc(100vh-140px)] md:min-h-[550px] sticky top-0 print:hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8 h-9 text-sm bg-white border-slate-200 focus:bg-white"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Branch List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
        {filteredBranches?.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No branch found
          </div>
        ) : (
          filteredBranches?.map((branch) => {
            const isSelected = String(branch?.id) === String(currentBranchId);
            return (
              <button
                key={branch?.id}
                onClick={() => handleSelectBranch(branch?.id)}
                disabled={isPending}
                className={cn(
                  "cursor-pointer w-full text-left p-3.5 transition-all flex items-center justify-between group hover:bg-slate-50 relative",
                  isSelected &&
                    "bg-emerald-50/70 hover:bg-emerald-50 border-l-4 border-emerald-600 font-semibold"
                )}
              >
                <div className="pr-2 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-semibold truncate transition-colors",
                      isSelected
                        ? "text-emerald-900 font-bold"
                        : "text-slate-700 group-hover:text-slate-900"
                    )}
                  >
                    {branch?.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{branch?.location || "N/A"}</span>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors",
                    isSelected
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  )}
                >
                  {branch?.active_stock_count ?? 0}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
