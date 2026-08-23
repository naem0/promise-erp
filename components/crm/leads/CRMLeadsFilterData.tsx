import { CRMCategory, getCRMCategories } from "@/apiServices/crmCategoryService";
import { Course, getCourses } from "@/apiServices/courseService";
import { CRMSource, getCRMSources } from "@/apiServices/crmSourceService";
import { CrmStatus, getCrmStatuses } from "@/apiServices/crmStatusesService";
import CRMLeadsFilter from "./CRMLeadsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsFilterData() {

    let categories: CRMCategory[] = [];
    let courses: Course[] = [];
    let sources: CRMSource[] = [];
    let statuses: CrmStatus[] = [];

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

    try {
        const res = await getCRMSources({ per_page: 500 });
        sources = res?.data?.sources || [];
    } catch (error: unknown) {
        console.error("Error fetching sources:", error);
    }

    try {
        const res = await getCrmStatuses({ per_page: 500 });
        statuses = res?.data?.statuses || [];
    } catch (error: unknown) {
        console.error("Error fetching lead statuses:", error);
    }

    return (
        <CRMLeadsFilter
            categories={categories}
            courses={courses}
            sources={sources}
            statuses={statuses}
        />
    );
}
