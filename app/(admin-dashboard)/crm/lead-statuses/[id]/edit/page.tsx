  import LeadStatusesForm from "@/components/crm/lead-statuses/LeadStatusesForm";
import { getCrmStatusById } from "@/apiServices/crmStatusesService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditLeadStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams?.id);
  
  let result;
  try {
    result = await getCrmStatusById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!result || !result?.data) {
    return (
      <NotFoundComponent
        message={result?.message || "Lead status not found"}
      />
    );
  }

  const item = result?.data;

  return (
    <div className="space-y-6 mx-auto">
      <LeadStatusesForm title="Edit Lead Status" item={item} />
    </div>
  );
}
