import CRMLeadsForm from "@/components/crm/leads/CRMLeadsForm";
import { getCRMLeadById } from "@/apiServices/crmLeadsService";
import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { getCourses } from "@/apiServices/courseService";
import { getCRMSources } from "@/apiServices/crmSourceService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCRMLeadPage({ params }: PageProps) {
    const { id } = await params;

    let leadRes;
    try {
        leadRes = await getCRMLeadById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching lead: ${error.message}`} />
                </div>
            );
        }
            
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="An unexpected error occurred." />
            </div>
        );
    }

    if (!leadRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent
                    message={leadRes?.message || "Lead not found."}
                />
            </div>
        );
    }

    // Fetch related lists in parallel for better performance
    const [branchesRes, categoriesRes, coursesRes, sourcesRes] = await Promise.allSettled([
        getBranches({ per_page: 500 }),
        getCRMCategories({ per_page: 500 }),
        getCourses({ per_page: 500 }),
        getCRMSources({ per_page: 500 }),
    ]);

    const branches = branchesRes.status === "fulfilled" ? (branchesRes.value?.data?.branches || []) : [];
    const categories = categoriesRes.status === "fulfilled" ? (categoriesRes.value?.data?.categories || []) : [];
    const courses = coursesRes.status === "fulfilled" ? (coursesRes.value?.data?.courses || []) : [];
    const sources = sourcesRes.status === "fulfilled" ? (sourcesRes.value?.data?.sources || []) : [];

    return (
        <CRMLeadsForm
            title="Edit CRM Lead"
            lead={leadRes.data}
            branches={branches}
            categories={categories}
            courses={courses}
            sources={sources}
        />
    );
}
