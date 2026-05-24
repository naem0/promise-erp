import CRMLeadsForm from "@/components/crm/leads/CRMLeadsForm";
import { getCRMLeadById } from "@/apiServices/crmLeadsService";
import { getBranches, Branch } from "@/apiServices/branchService";
import { getCRMCategories, CRMCategory } from "@/apiServices/crmCategoryService";
import { getCourses, Course } from "@/apiServices/courseService";
import { getCRMSources, CRMSource } from "@/apiServices/crmSourceService";
import { getCRMReferrers, CRMReferrer } from "@/apiServices/crmReferrerService";
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
            console.error("Error fetching lead:", error.message);
        }
        else {
            console.error("Error fetching lead:", error);
        }
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

    let branches: Branch[] = [];
    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching branches:", error.message);
        }
        else {
            console.error("Error fetching branches:", error);
        }
    }

    let categories: CRMCategory[] = [];
    try {
        const res = await getCRMCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching CRM categories:", error.message);
        }
        else {
            console.error("Error fetching CRM categories:", error);
        }
    }

    let courses: Course[] = [];
    try {
        const res = await getCourses({ per_page: 500 });
        courses = res?.data?.courses || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching courses:", error.message);
        }
        else {
            console.error("Error fetching courses:", error);
        }
    }

    let sources: CRMSource[] = [];
    try {
        const res = await getCRMSources({ per_page: 500 });
        sources = res?.data?.sources || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching CRM sources:", error.message);
        }
        else {
            console.error("Error fetching CRM sources:", error);
        }
    }

    let referrers: CRMReferrer[] = [];
    try {
        const res = await getCRMReferrers({ per_page: 500 });
        referrers = res?.data?.referrers || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching CRM referrers:", error.message);
        }
        else {
            console.error("Error fetching CRM referrers:", error);
        }
    }

    return (
        <CRMLeadsForm
            title="Edit CRM Lead"
            lead={leadRes.data}
            branches={branches}
            categories={categories}
            courses={courses}
            sources={sources}
            referrers={referrers}
        />
    );
}
