import ReferrersForm from "@/components/crm/lead-referrers/ReferrersForm";
import { getBranches, Branch } from "@/apiServices/branchService";

export default async function AddReferrerPage() {
    let branches: Branch[] = [];
    try {
        const branchesRes = await getBranches({ per_page: 500 });
        branches = branchesRes?.data?.branches || [];
    } catch (error) {
        console.error("Failed to load branches for referrer form:", error);
    }

    return (
        <div className="mx-auto">
            <ReferrersForm title="Add New Lead Referrer" branches={branches} />
        </div>
    );
}
