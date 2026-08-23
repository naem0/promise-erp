"use client";


import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Check } from "lucide-react";
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSelectDivision = (divisionName: string) => {
    setActiveTab(divisionName);
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6 w-full space-y-4">
      {/* Mobile Search & Filter Row (Figma Design) */}
      <div className="flex items-center gap-2 xl:hidden w-full">
        {/* Search Input Container */}
        <div className="relative flex-1 bg-white rounded-xl border border-gray-300 dark:border-gray-700 shadow-xs focus-within:border-primary transition-all">
          <Input
            placeholder="Search Branch"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 h-11 text-sm rounded-xl border-none focus-visible:ring-0 text-gray-700 placeholder:text-gray-400"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" strokeWidth={1.5} />
        </div>

        {/* Filter Icon Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl border border-gray-300 dark:border-gray-700 bg-white hover:bg-gray-50 text-gray-600 relative"
              aria-label="Filter Divisions"
            >
              <Filter className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
              {activeTab && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Division
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                onClick={() => handleSelectDivision("")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                  activeTab === ""
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {activeTab === "" && <Check className="h-4 w-4" />}
                All
              </button>
              {divisions?.data?.map((division) => {
                const isSelected = activeTab === division?.name;
                return (
                  <button
                    key={division?.id}
                    type="button"
                    onClick={() => handleSelectDivision(division?.name)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    {division?.name}
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Search & Tabs Header */}
      <div className="hidden xl:flex flex-row items-center gap-4 w-full bg-primary/10 rounded-xl p-2">
        {/* Division Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 w-auto"
        >
          <TabsList className="flex flex-row flex-wrap space-x-2 w-auto bg-primary/20 p-1 rounded-xl h-auto">
            {/* All — value="" clears the division filter */}
            <TabsTrigger
              value=""
              className="cursor-pointer rounded-full px-4 py-1 font-semibold
                data-[state=active]:bg-primary
                data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            {divisions?.data?.map((division) => (
              <TabsTrigger
                key={division?.id}
                value={division?.name}
                className="cursor-pointer rounded-full px-4 py-1 font-semibold
                  data-[state=active]:bg-primary
                  data-[state=active]:text-white"
              >
                {division?.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative w-64 bg-white rounded-full border border-primary/80 shrink-0">
          <Input
            placeholder="Search Branch"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 h-10 text-sm rounded-full"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default BranchHeader;
