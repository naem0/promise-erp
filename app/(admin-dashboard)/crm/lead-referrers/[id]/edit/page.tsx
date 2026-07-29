import { getCRMReferrerById } from "@/apiServices/crmReferrerService";
import { getBranches, Branch } from "@/apiServices/branchService";
import ReferrersForm from "@/components/crm/lead-referrers/ReferrersForm";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function EditReferrerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let referrer = null;
  let branches: Branch[] = [];

  try {
    const referrerResponse = await getCRMReferrerById(Number(id));
    if (referrerResponse && referrerResponse?.success && referrerResponse?.data) {
      referrer = referrerResponse?.data;
    } else {
      return <ErrorComponent message={referrerResponse?.message || "Referrer not found"} />;
    }
  } catch (error: unknown) {
    return (
      <ErrorComponent
        message={error instanceof Error ? error.message : "Failed to load referrer"}
      />
    );
  }

  try {
    const branchesResponse = await getBranches({ per_page: 500 });
    if (branchesResponse && branchesResponse?.data?.branches) {
      branches = branchesResponse?.data?.branches;
    }
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("Failed to load branches:", error.message);
      branches = [];
    }else {
      console.error("Failed to load branches:", error);
    }
    
  }

  return (
    <div className="mx-auto">
      <ReferrersForm title="Edit Lead Referrer" referrer={referrer} branches={branches} />
    </div>
  );
}
