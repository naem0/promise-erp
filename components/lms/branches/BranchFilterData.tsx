import { getDistricts } from "@/apiServices/districtService";
import BranchFilter from "./BranchFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function BranchFilterData() {
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

    return <BranchFilter districts={districts} />;
}