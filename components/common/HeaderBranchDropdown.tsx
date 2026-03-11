"use client";

import { useState, useEffect, useTransition } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

const HeaderBranchDropdown = () => {
  const [branchList, setBranchList] = useState<HeaderBranchList[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch branches with startTransition
  useEffect(() => {
    startTransition(() => {
      const fetchBranchList = async () => {
        try {
          const res = await getPublicBranchList();
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
  }, [searchParams]);

  const handleBranchSelect = (branchId: number) => {
    setSelectedBranch(branchId);
    startTransition(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("branch_id", branchId.toString());
      router.replace(`/?${params.toString()}`);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-base header-branch-filter-btn h-8 px-4 flex items-center gap-2 text-secondary cursor-pointer">
          <Funnel className="h-4 w-4" />{" "}
          {isPending
            ? "Loading..."
            : branchList.find((b) => b.id === selectedBranch)?.name || "Branch"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-4 gap-1 p-4 w-full">
        {isPending ? (
          <DropdownMenuItem disabled>Loading Branch...</DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => handleBranchSelect(1)}
              className={
                selectedBranch === 1 ? "cursor-pointer" : "cursor-pointer"
              }
            >
              All Branches
            </DropdownMenuItem>
            {branchList.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => handleBranchSelect(branch.id)}
                className={
                  selectedBranch === branch.id
                    ? "bg-secondary text-white cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {branch.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderBranchDropdown;
