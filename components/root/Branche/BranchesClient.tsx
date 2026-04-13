// import BranchCard from "@/components/root/Branche/BranchCard";
// import { getPublicWebBranches, WebBranchApiResponse, WebBranch, WebBranchData } from "@/apiServices/branchService";
// import ErrorComponent from "@/components/common/ErrorComponent";
// import NotFoundComponent from "@/components/common/NotFoundComponent";
// import BranchHeader from "./BranchHeader";

// interface BranchesPageProps {
//     searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// const BranchesClient = async ({ searchParams }: BranchesPageProps) => {
//     let branches: WebBranch[] = [];
//     let divisions: WebBranchData[] = [];
//     let result: WebBranchApiResponse | null = null;

//     const querParams = await searchParams;
//     const params = {
//         search: typeof querParams?.search === "string" ? querParams.search : undefined,
//         division_name: typeof querParams?.division_name === "string" ? querParams.division_name : undefined,
//     }

//     try {
//         const res = await getPublicWebBranches(params);
//         if (res.success) {
//             result = res;
//             divisions = res?.data || [];
//             branches = divisions.flatMap(division => division.branches) || [];
//         }
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.error("Failed to fetch branches:", error.message);
//             return <ErrorComponent message={error.message} />;
//         } else {
//             console.error("Failed to fetch branches:", error);
//             return <ErrorComponent message="An unexpected error occurred." />;
//         }
//     }

//     return (
//         <section className="py-8 md:py-12">
//             <div className="mx-auto container px-4">
//                 <BranchHeader />
//                 <div className="grid gap-4 md:grid-cols-2">
//                     {branches.length === 0 ? (
//                         <NotFoundComponent message={result?.message || "No branches found"} />
//                     ) : (
//                         branches?.map((branch: WebBranch) => (
//                             <BranchCard
//                                 key={branch.id}
//                                 branchInfo={branch}
//                             />
//                         ))
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BranchesClient;

import BranchCard from "@/components/root/Branche/BranchCard";
import {
  getPublicWebBranches,
  getPublicDivisionList,
  WebBranchApiResponse,
  WebBranch,
  WebBranchData,
  PublicDivisionApiResponse,
} from "@/apiServices/branchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import BranchHeader from "./BranchHeader";

interface BranchesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BranchesClient = async ({ searchParams }: BranchesPageProps) => {
  let branches: WebBranch[] = [];
  let divisions: WebBranchData[] = [];
  let result: WebBranchApiResponse | null = null;
  let divisionList: PublicDivisionApiResponse | null = null;

  const querParams = await searchParams;
  const params = {
    search:
      typeof querParams?.search === "string" ? querParams.search : undefined,
    division_name:
      typeof querParams?.division_name === "string"
        ? querParams.division_name
        : undefined,
  };

  try {
    // Fetch branches
    const res = await getPublicWebBranches(params);
    if (res.success) {
      result = res;
      divisions = res?.data || [];
      branches = divisions.flatMap((division) => division.branches) || [];
    }

    // Fetch divisions server-side
    const divisionRes = await getPublicDivisionList();
    if (divisionRes.success) {
      divisionList = divisionRes;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch branches:", error.message);
      return <ErrorComponent message={error.message} />;
    } else {
      console.error("Failed to fetch branches:", error);
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto container px-4">
        {/* Pass server-side division data */}
        <BranchHeader divisions={divisionList} />
        <div className="grid gap-4 md:grid-cols-2">
          {branches.length === 0 ? (
            <div className="col-span-full flex justify-center items-center w-full">
              <NotFoundComponent
                message={result?.message || "No branches found"}
              />
            </div>
          ) : (
            branches?.map((branch: WebBranch) => (
              <BranchCard key={branch.id} branchInfo={branch} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BranchesClient;
