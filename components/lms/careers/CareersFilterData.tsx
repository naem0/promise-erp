import { getBranches } from "@/apiServices/branchService";
import { getCareerCategories } from "@/apiServices/careerService";
import CareersFilter from "./CareersFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CareersFilterData() {
    let branches;
    let categories;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching branches: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
                </div>
            );
        }
    }

    try {
        const res = await getCareerCategories({ per_page: 500 });
        categories = res?.data?.career_categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching career categories: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching career categories.`} />
                </div>
            );
        }
    }

    return (
        <CareersFilter
            branches={branches}
            categories={categories}
        />
    );
}
