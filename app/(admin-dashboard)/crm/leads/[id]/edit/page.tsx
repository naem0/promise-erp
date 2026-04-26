import CRMLeadsForm from "@/components/crm/leads/CRMLeadsForm";
import { getCRMLeadById } from "@/apiServices/crmLeadsService";
import { getBranches } from "@/apiServices/branchService";
import { getCRMCategories } from "@/apiServices/crmCategoryService";
import { getCourses } from "@/apiServices/courseService";
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

    // Fetch related lists
    let branches;
    let categories;
    let courses;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
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
            title="Edit CRM Lead"
            lead={leadRes.data}
            branches={branches}
            categories={categories}
            courses={courses}
        />
    );
}
