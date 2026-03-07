"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobCircularData } from "@/apiServices/jobCircularPublicService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface JobCircularSearchProps {
  jobCirculars: JobCircularData;
}

const JobCircularSearch = ({ jobCirculars }: JobCircularSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.replace(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section className="pt-8 md:pt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between bg-secondary p-4 md:p-6 rounded-xl">
          {/* Total Jobs */}
          <div className="text-white flex gap-4 items-center text-center">
            <h4 className="text-4xl lg:text-6xl text-primary font-bold">
              {jobCirculars?.total_careers}
            </h4>
            <h4 className="text-2xl lg:text-3xl font-semibold">
              Job <br /> Available
            </h4>
          </div>

          {/* Search Section */}
          <div className="flex flex-col gap-4 md:items-end">
            <h1 className="text-xl font-bold text-white md:text-3xl">
              Open Positions
            </h1>

            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
              <Input
                value={search}
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="pl-10 rounded-full border-none bg-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCircularSearch;
