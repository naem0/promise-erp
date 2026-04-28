import { getDesignationById } from "@/apiServices/designationService";
import DesignationsForm from "@/components/lms/designations/DesignationsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export const metadata = {
  title: "Edit Designation | LMS",
};

export default async function EditDesignationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let result;
    try {
        result = await getDesignationById(Number(id));
    } catch (error: any) {
        return <ErrorComponent message={error.message || "Failed to fetch designation"} />;
    }

    if (!result || !result.success || !result.data) {
        return <NotFoundComponent message={result?.message || "Designation not found"} />;
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <DesignationsForm 
                title="Edit Designation" 
                designation={result.data} 
            />
        </div>
    );
}
