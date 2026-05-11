import CRMSourcesForm from "@/components/crm/sources/CRMSourcesForm";
import { getCRMSourceById } from "@/apiServices/crmSourceService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCRMSourcePage({ params }: PageProps) {
    const { id } = await params;

    let sourceRes;
    try {
        sourceRes = await getCRMSourceById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching source: ${error.message}`} />
                </div>
            );
        }
            
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="An unexpected error occurred." />
            </div>
        );
    }

    if (!sourceRes) {
        return null
    }

    if (!sourceRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent
                    message={sourceRes?.message || "Source not found."}
                />
            </div>
        );
    }

    return (
        <CRMSourcesForm
            title="Edit CRM Source"
            source={sourceRes?.data}
        />
    );
}
