import React from "react";
import { getDeliveryById } from "@/apiServices/inventoryBrandsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import DeliveryDetailsPage from "@/components/inventory/delivery/DeliveryDetailsPage";

interface DeliveryDetailsLoaderProps {
  params: Promise<{ id: string }>;
}

export default async function DeliveryDetailsLoader({
  params,
}: DeliveryDetailsLoaderProps) {
  const { id } = await params;

  let deliveryData = null;
  let errorMsg = null;

  try {
    const res = await getDeliveryById(id);

    if (res?.success) {
      deliveryData = res?.data;
    } else {
      errorMsg = res?.message || "Failed to load delivery details.";
    }
  } catch (err: unknown) {
    console.error("Error fetching delivery details:", err);
    errorMsg =
      err instanceof Error ? err.message : "Error fetching delivery details";
  }

  if (errorMsg) {
    return (
      <div className=" p-4">
        <ErrorComponent message={errorMsg} />
      </div>
    );
  }

  if (!deliveryData) {
    return (
      <div className=" p-4">
        <NotFoundComponent message="Delivery details not found." />
      </div>
    );
  }

  return <DeliveryDetailsPage data={deliveryData} />;
}
