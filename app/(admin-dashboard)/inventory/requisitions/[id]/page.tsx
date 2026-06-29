import { Suspense } from "react";
import RequisitionDetailWrapper from "@/components/inventory/requisitions/RequisitionDetailWrapper";
import RequisitionDetailSkeleton from "@/components/inventory/requisitions/RequisitionDetailSkeleton";

interface RequisitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequisitionDetailPage({
  params,
}: RequisitionDetailPageProps) {
  const { id } = await params;
  const requisitionId = Number(id);

  return (
    <Suspense fallback={<RequisitionDetailSkeleton />}>
      <RequisitionDetailWrapper id={requisitionId} />
    </Suspense>
  );
}
