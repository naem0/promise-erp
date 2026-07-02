import RequisitionDetail from "@/components/inventory/requisitions/RequisitionDetail";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
  getRequisitionById,
  SingleRequisitionResponse,
} from "@/apiServices/requisitionsService";

interface RequisitionDetailWrapperProps {
  id: number;
}

export default async function RequisitionDetailWrapper({
  id,
}: RequisitionDetailWrapperProps) {
  let requisition: SingleRequisitionResponse | null = null;

  try {
    requisition = await getRequisitionById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={`Error fetching requisition: ${error.message}`}
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while fetching requisition." />
        </div>
      );
    }
  }

  if (!requisition || !requisition.success) {
    return null;
  }

  if (!requisition?.data) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message="Requisition not found." />
      </div>
    );
  }

  return <RequisitionDetail requisition={requisition?.data} />;
}
