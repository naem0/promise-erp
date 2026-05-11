import CRMLeadsForm from "@/components/crm/leads/CRMLeadsForm";
import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { getCourses } from "@/apiServices/courseService";
import { getCRMSources } from "@/apiServices/crmSourceService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CRMLeadsAddPage() {
    // Fetch related lists in parallel for better performance
    const [branchesRes, categoriesRes, coursesRes, sourcesRes] = await Promise.allSettled([
        getBranches({ per_page: 500 }),
        getCRMCategories({ per_page: 500 }),
        getCourses({ per_page: 500 }),
        getCRMSources({ per_page: 500 }),
    ]);

    // Handle potential failures or empty data
    const branches = branchesRes.status === "fulfilled" ? (branchesRes.value?.data?.branches || []) : [];
    const categories = categoriesRes.status === "fulfilled" ? (categoriesRes.value?.data?.categories || []) : [];
    const courses = coursesRes.status === "fulfilled" ? (coursesRes.value?.data?.courses || []) : [];
    const sources = sourcesRes.status === "fulfilled" ? (sourcesRes.value?.data?.sources || []) : [];

    return (
        <CRMLeadsForm
            title="Add CRM Lead"
            branches={branches}
            categories={categories}
            courses={courses}
            sources={sources}
        />
    );
}
