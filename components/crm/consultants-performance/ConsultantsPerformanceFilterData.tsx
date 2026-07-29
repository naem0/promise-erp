import { getBranches } from "@/apiServices/branchService";
import ConsultantsPerformanceFilter from "./ConsultantsPerformanceFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ConsultantsPerformanceFilterData() {
    let branches;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching branches: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
          </div>);
      }
    }

    return (
        <ConsultantsPerformanceFilter
            branches={branches}
        />
    );
}
