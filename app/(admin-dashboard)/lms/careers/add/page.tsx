import CareerForm from "@/components/lms/careers/CareerForm";
import { getBranches } from "@/apiServices/branchService";
import { getCareerCategories } from "@/apiServices/careerService";
import { getTools } from "@/apiServices/toolsService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CareersAddPage() {
    let branches;
    let categories;
    let allTools;

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

    try {
        const res = await getTools({ per_page: 500 });
        allTools = res?.data?.tools || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching tools: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching tools.`} />
                </div>
            );
        }
    }

    return (
        <CareerForm
            title="Add Career"
            branches={branches}
            categories={categories}
            allTools={allTools}
        />
    );
}
