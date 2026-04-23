
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PublicDivisionApiResponse } from "@/apiServices/branchService";

interface BranchHeaderProps {
  divisions: PublicDivisionApiResponse | null;
}

const BranchHeader = ({ divisions }: BranchHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const [activeTab, setActiveTab] = useState(
    searchParams.get("division_name") || "",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (searchTerm) params.set("search", searchTerm);
      if (activeTab) params.set("division_name", activeTab);

      router.push(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, router, pathname]);

  if (!divisions) return null;

  return (
    <div className="flex flex-col lg:flex-row md:items-center gap-4 mb-6 w-full bg-primary/10 rounded-xl p-2">
      {/* Division Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 w-full lg:w-auto"
      >
        <TabsList className="flex flex-col w-full lg:flex-row flex-wrap lg:space-x-2 lg:w-auto bg-primary/20 p-1 rounded-xl h-auto">
          {/* All — value="" clears the division filter */}
          <TabsTrigger
            value=""
            className="cursor-pointer w-full lg:w-auto rounded-full px-4 py-1 font-semibold
              data-[state=active]:bg-primary
              data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          {divisions.data.map((division) => (
            <TabsTrigger
              key={division.id}
              value={division.name}
              className="cursor-pointer w-full lg:w-auto rounded-full px-4 py-1 font-semibold
                data-[state=active]:bg-primary
                data-[state=active]:text-white"
            >
              {division.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative w-full lg:w-56 bg-white rounded-full border border-primary/80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        <Input
          placeholder="Search branches..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 h-10 text-sm rounded-full"
        />
      </div>
    </div>
  );
};

export default BranchHeader;
