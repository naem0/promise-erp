import DeliveryChallanPage from "@/components/inventory/requisitions/shipping/challan/DeliveryChallanPage";
import { getDeliveryChallanInvoice } from "@/apiServices/inventoryBrandsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface ChallanPageProps {
  params: Promise<{ id: string }>;
}

export default async function DeliveryChallanRoute({
  params,
}: ChallanPageProps) {
  const { id } = await params;

  let invoiceData = null;
  let errorMsg = null;
  try {
    const res = await getDeliveryChallanInvoice(id);
    if (res?.success) {
      invoiceData = res?.data;
    } else {
      errorMsg = res?.message || "Failed to load challan data.";
    }
  } catch (err: unknown) {
    console.error("Error fetching delivery invoice:", err);
    errorMsg = err instanceof Error ? err.message : "Error fetching delivery invoice";
  }

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <ErrorComponent message={errorMsg} />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <NotFoundComponent message="Challan data not found." />
      </div>
    );
  }

  return (
    <div className="mx-auto print:mx-0 print:w-full print:max-w-none">
      <DeliveryChallanPage invoiceData={invoiceData} />
    </div>
  );
}
