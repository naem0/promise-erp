import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { Consultant, getConsultants } from "@/apiServices/crmLeadsActions";
import { getCourses } from "@/apiServices/courseService";
import CRMLeadsFilter from "./CRMLeadsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsFilterData() {

    let branches = [];
    let categories = [];
    let consultants: Consultant[] = [];
    let courses = [];

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

    try {
        const res = await getCRMCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error: unknown) {
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

    try {
        const res = await getConsultants();
        consultants = res?.data?.consultants || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching consultants: ${error.message}`} />
            </div>);
        } else {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching consultants.`} />
            </div>);
        }
    }

    try {
        const res = await getCourses({ per_page: 500 });
        courses = res?.data?.courses || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching courses: ${error.message}`} />
            </div>);
        } else {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching courses.`} />
            </div>);
        }
    }

    return (
        <CRMLeadsFilter
            branches={branches}
            categories={categories}
            consultants={consultants}
            courses={courses}
        />
    );
}
