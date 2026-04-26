import CRMLeadsForm from "@/components/crm/leads/CRMLeadsForm";
import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { getCourses } from "@/apiServices/courseService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsAddPage() {
    let branches;
    let categories;
    let courses;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
           <div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching branches: ${error.message}`} />
            </div>
        } else {
            <div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
            </div>
        }
    }

    try {
        const res = await getCRMCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            <div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching categories: ${error.message}`} />
            </div>
        } else {
            <div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching categories.`} />
            </div>
        }
    }

    try {
        const res = await getCourses({ per_page: 500 });
        courses = res?.data?.courses || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            <div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching courses: ${error.message}`} />
            </div>
        } else {
            <div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching courses.`} />
            </div>
        }
    }

    return (
        <CRMLeadsForm
            title="Add CRM Lead"
            branches={branches}
            categories={categories}
            courses={courses}
        />
    );
}
