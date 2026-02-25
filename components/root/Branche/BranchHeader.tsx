// "use client";

// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { useState, useEffect, useTransition } from "react";
// import {
//   getPublicDivisionList,
//   PublicDivisionApiResponse,
// } from "@/apiServices/branchService";
// import ErrorComponent from "@/components/common/ErrorComponent";

// const BranchHeader = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const [divisions, setDivisions] = useState<PublicDivisionApiResponse | null>(null);
//   const [searchTerm, setSearchTerm] = useState(
//     searchParams.get("search") || ""
//   );
//   const [activeTab, setActiveTab] = useState(
//     searchParams.get("division_name") || ""
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();

//   const hasFilter = Boolean(searchTerm || activeTab );

//   useEffect(() => {
//     const fetchDivisions = async () => {
//       try {
//         const res = await getPublicDivisionList();
//         if (res.success) {
//           setDivisions(res);
//           setError(null);
//         } else {
//           setError(res.message || "Failed to load divisions");
//         }
//       } catch (err: unknown) {
//         if (err instanceof Error) setError(err.message);
//         else setError("Unknown error occurred.");
//       }
//     };

//     fetchDivisions();
//   }, []);

//   useEffect(() => {
//     if (!searchParams.get("division_name")) {
//       const params = new URLSearchParams(searchParams.toString());
//       if (searchTerm) params.set("search", searchTerm);
//       router.replace(`${pathname}?${params.toString()}`);
//     }
//   }, [searchParams, router, pathname, searchTerm]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       startTransition(() => {
//         const params = new URLSearchParams();
//         if (searchTerm) params.set("search", searchTerm);
//         if (activeTab) params.set("division_name", activeTab);

//         router.push(
//           params.toString() ? `${pathname}?${params.toString()}` : pathname
//         );
//       });
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchTerm, activeTab, router, pathname]);

//   const clearFilters = () => {
//     setSearchTerm("");
//     setActiveTab(" ");
//     startTransition(() => {
//       const params = new URLSearchParams();
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   if (!divisions) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col lg:flex-row md:items-center gap-4 mb-6 w-full bg-primary/10 rounded-xl p-2">
//       {/* Division Tabs */}
//       {error ? (
//         <ErrorComponent message={error} />
//       ) : (
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="flex-1 w-full lg:w-auto"
//         >
//           <TabsList className="flex flex-col w-full lg:flex-row lg:space-x-2 lg:w-auto bg-primary/20 p-1 rounded-xl h-auto">
//             { divisions?.data?.map((division) => (
//                 <TabsTrigger
//                   key={division.id}
//                   value={division.name}
//                   className="w-full lg:w-auto rounded-full px-4 py-1 font-semibold
//                     data-[state=active]:bg-primary
//                     data-[state=active]:text-white"
//                 >
//                   {division.name}
//                 </TabsTrigger>
//               ))}
//           </TabsList>
//         </Tabs>
//       )}

//       {/* Search Input */}
//       <div className="relative w-full lg:w-56 bg-white rounded-full border border-primary/80">
//         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
//         <Input
//           placeholder="Search branches..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10 pr-4 h-10 text-sm rounded-full"
//         />
//       </div>

//       {/* Clear Button */}
//       {hasFilter && (
//         <button
//           onClick={clearFilters}
//           className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition"
//         >
//           Clear Filters
//         </button>
//       )}
//     </div>
//   );
// };

// export default BranchHeader;

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

  const hasFilter = Boolean(searchTerm || activeTab);

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

  const clearFilters = () => {
    setSearchTerm("");
    setActiveTab("");
    router.push(pathname);
  };

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 h-10 text-sm rounded-full"
        />
      </div>

      {/* Clear Button */}
      {hasFilter && (
        <button
          onClick={clearFilters}
          className="px-4 cursor-pointer py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default BranchHeader;
