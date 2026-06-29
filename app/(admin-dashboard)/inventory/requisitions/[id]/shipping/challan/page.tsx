import DeliveryChallanPage from "@/components/inventory/requisitions/shipping/challan/DeliveryChallanPage";

interface ChallanPageProps {
  params: Promise<{ id: string }>;
}

export default async function DeliveryChallanRoute({
  params,
}: ChallanPageProps) {
  const { id } = await params;
  const requisitionId = Number(id);

  return (
    <div className="mx-auto">
      <DeliveryChallanPage requisitionId={requisitionId} />
    </div>
  );
}
