import MyAssignedItemsData from "@/components/inventory/item-users/MyAssignedItemsData";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function MyAssignedItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PermissionGuard requiredPermission="view-my-product-users">
      <div className="mx-auto space-y-6" suppressHydrationWarning>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            My Assigned Items
          </h1>
        </div>

        <Suspense fallback={<TableSkeleton columns={6} rows={8} />}>
          <MyAssignedItemsData searchParams={searchParams} />
        </Suspense>
      </div>
    </PermissionGuard>
  );
}
