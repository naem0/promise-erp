import React, { Suspense } from "react";
import DeliveryDetailsLoader from "./DeliveryDetailsLoader";
import DeliveryDetailsSkeleton from "@/components/inventory/delivery/details/DeliveryDetailsSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DeliveryDetailsRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<DeliveryDetailsSkeleton />}>
      <DeliveryDetailsLoader params={params} />
    </Suspense>
  );
}
