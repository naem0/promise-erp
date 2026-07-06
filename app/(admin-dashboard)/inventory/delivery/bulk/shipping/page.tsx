import RequisitionShippingForm from "@/components/inventory/requisitions/shipping/RequisitionShippingForm";

interface BulkShippingPageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function BulkRequisitionShippingPage({
  searchParams,
}: BulkShippingPageProps) {
  const { ids } = await searchParams;

  const requisitionIds = ids
    ? ids
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id))
    : [];

  return (
    <div className="mx-auto">
      <RequisitionShippingForm requisitionIds={requisitionIds} />
    </div>
  );
}
