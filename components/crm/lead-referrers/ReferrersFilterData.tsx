import { getBranches } from "@/apiServices/branchService";
import ReferrersFilter from "./ReferrersFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ReferrersFilterData() {
    let branches = [];

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-2">
                    <ErrorComponent message={`Error fetching branches: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-2">
                    <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
                </div>
            );
        }
    }

    return (
        <ReferrersFilter branches={branches} />
    );
}
