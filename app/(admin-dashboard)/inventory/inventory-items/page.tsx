import ItemsData from "@/components/inventory/inventory-items/ItemsData";
import ItemsFilterData from "@/components/inventory/inventory-items/ItemsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackagePlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import ItemsSummaryWrapper from "@/components/inventory/ItemsSummaryWrapper";

export default function InventoryItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Items
        </h1>

        <div className="flex items-center gap-2">
          <PermissionGuard requiredPermission="stock-update">
            <Button asChild variant="outline">
              <Link href="/inventory/inventory-items/stock-update">
                <PackagePlus className="w-4 h-4 mr-2" />Stock Update
              </Link>
            </Button>
          </PermissionGuard>

          <PermissionGuard requiredPermission="create-products">
            <Button asChild>
              <Link href="/inventory/inventory-items/add">
                <PlusCircle className="w-4 h-4 mr-2" />Add Item
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      </div>
      
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        }
      >
        <ItemsSummaryWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ItemsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <ItemsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
