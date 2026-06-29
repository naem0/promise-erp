import RequisitionShippingForm from "@/components/inventory/requisitions/shipping/RequisitionShippingForm";

interface ShippingPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequisitionShippingPage({
  params,
}: ShippingPageProps) {
  const { id } = await params;
  const requisitionId = Number(id);

  return (
    <div className="mx-auto">
      <RequisitionShippingForm requisitionId={requisitionId} />
    </div>
  );
}
