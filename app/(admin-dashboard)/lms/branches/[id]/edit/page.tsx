import BranchesForm from "@/components/lms/branches/BranchesForm";
import { getBranchById } from "@/apiServices/branchService";
import { getDistricts } from "@/apiServices/districtService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBranchPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch branch
    let branchRes;
    try {
        branchRes = await getBranchById(id);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!branchRes?.data) {
        return <NotFoundComponent message={branchRes?.message || "Branch not found."} />;
    }

    // Fetch districts
    let districts;
    try {
        const res = await getDistricts({ per_page: 999 });
        districts = res?.data?.districts || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching districts: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching districts.`} />
                </div>
            );
        }
    }

    return (
        <BranchesForm
            title="Edit Branch"
            branch={branchRes.data}
            districts={districts}
        />
    );
}
