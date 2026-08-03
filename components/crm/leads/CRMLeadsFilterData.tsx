import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { getCourses } from "@/apiServices/courseService";
import CRMLeadsFilter from "./CRMLeadsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsFilterData() {

    let categories = [];
    let courses = [];

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
            categories={categories}
            courses={courses}
        />
    );
}
