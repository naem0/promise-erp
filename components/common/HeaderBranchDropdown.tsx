"use client";

import { useState, useEffect, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Funnel } from "lucide-react";
import {
  getPublicBranchList,
  HeaderBranchList,
} from "@/apiServices/homePageService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const HeaderBranchDropdown = () => {
  const [branchList, setBranchList] = useState<HeaderBranchList[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(49); // Default to "All Branches" with ID 49 Dhaka Branch
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Fetch branches with startTransition
  useEffect(() => {
    startTransition(() => {
      const fetchBranchList = async () => {
        try {
          const res = await getPublicBranchList();
          if (!res) return;
          if (res.success) {
            setBranchList(res?.data?.branches || []);

            // Set default selected branch from query params
            const branchParam = searchParams.get("branch_id");
            if (branchParam) setSelectedBranch(parseInt(branchParam));
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error fetching branch list:", error.message);
          } else {
            console.error("Unknown error fetching branch list");
          }
        }
      };
      fetchBranchList();
    });
  }, []);

  const handleBranchSelect = (branchId: number) => {
  setSelectedBranch(branchId);

  startTransition(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("branch_id", branchId.toString());
    router.replace(`${pathname}?${params.toString()}`);
  });
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild suppressHydrationWarning>
        <button
          type="button"
          aria-label="Select Branch"
          suppressHydrationWarning
          className="text-base header-branch-filter-btn h-8 px-4 flex items-center gap-2 text-secondary cursor-pointer border-0 bg-transparent"
        >
          <Funnel className="h-4 w-4" />{" "}
          {isPending ? (
            <Skeleton className="h-4 w-16 rounded" />
          ) : (
            branchList.find((b) => b.id === selectedBranch)?.name || "Branch"
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-4 gap-1 p-4 w-full">
        {isPending ? (
          <DropdownMenuItem disabled>
            <Skeleton className="h-4 w-24 rounded" />
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => handleBranchSelect(49)} // ID 49 for Dhaka Branch
              className={
                selectedBranch === 49 ? "cursor-pointer" : "cursor-pointer"
              }
            >
              All Branches
            </DropdownMenuItem>
            {branchList?.map((branch) => (
              <DropdownMenuItem
                key={branch?.id}
                onClick={() => handleBranchSelect(branch?.id)}
                className={
                  selectedBranch === branch?.id
                    ? "bg-secondary text-white cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {branch?.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderBranchDropdown;
