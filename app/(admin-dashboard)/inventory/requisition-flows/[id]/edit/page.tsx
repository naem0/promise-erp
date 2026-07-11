import { getRequisitionFlowById } from "@/apiServices/inventoryRequisitionFlowsService";
import RequisitionFlowsForm from "@/components/inventory/requisition-flows/RequisitionFlowsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditRequisitionFlowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  let result;
  try {
    result = await getRequisitionFlowById(id);
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
        message={result?.message || "Requisition flow not found"}
      />
    );
  }

  const item = result?.data;

  return (
    <div className="space-y-6 mx-auto">
      <RequisitionFlowsForm title="Edit Requisition Flow" item={item} />
    </div>
  );
}
