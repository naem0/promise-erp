import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import CRMLeadsFilter from "./CRMLeadsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsFilterData() {

    let branches = [];
    let categories = [];

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
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

    try {
        const res = await getCRMCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching categories: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching categories.`} />
          </div>);
        }
    }

    return (
        <CRMLeadsFilter
            branches={branches}
            categories={categories}
        />
    );
}
