import DeliveryPageClient from "@/components/inventory/delivery/DeliveryPageClient";
import { getInventoryDeliveries } from "@/apiServices/inventoryBrandsService";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";

interface DeliveryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DeliveryPage({
  searchParams,
}: DeliveryPageProps) {
  const queryParams = await searchParams;
  const page =
    typeof queryParams.page === "string" ? Number(queryParams.page) : 1;
  const per_page =
    typeof queryParams.per_page === "string"
      ? Number(queryParams.per_page)
      : 15;
  const params = {
    page,
    per_page,
    search:
      typeof queryParams.search === "string" ? queryParams.search : undefined,
    status:
      typeof queryParams.status === "string" ? queryParams.status : undefined,
    sort_order:
      typeof queryParams.sort_order === "string"
        ? queryParams.sort_order
        : undefined,
    delivery_date:
      typeof queryParams.delivery_date === "string"
        ? queryParams.delivery_date
        : undefined,
    delivery_type:
      typeof queryParams.delivery_type === "string"
        ? queryParams.delivery_type
        : undefined,
    delivery_branch:
      typeof queryParams.delivery_branch === "string"
        ? queryParams.delivery_branch
        : undefined,
  };

  let DeliveriesList = null;
  try {
    DeliveriesList = await getInventoryDeliveries(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching inventory deliveries:", error.message);
    } else {
      console.error(
        "An unknown error occurred while fetching inventory deliveries.",
      );
    }
  }

  return (
    <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
      <DeliveryPageClient deliveriesList={DeliveriesList} />
    </Suspense>
  );
}
