import BranchesForm from "@/components/lms/branches/BranchesForm";
import { getDistricts } from "@/apiServices/districtService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function BranchesAddPage() {
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
            title="Add Branch"
            districts={districts}
        />
    );
}
