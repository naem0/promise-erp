import PermissionGuard from "@/components/auth/PermissionGuard";
import { Suspense } from "react";
import InventoryReportsData from "@/components/inventory/reports/InventoryReportsData";
import TableSkeleton from "@/components/TableSkeleton";

export default function InventoryReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PermissionGuard
      requiredPermission={["view-inventory-reports", "view-products"]}
      mode="any"
    >
      <div className="mx-auto space-y-6 print:w-full print:max-w-none print:m-0 print:p-0 print:space-y-4" suppressHydrationWarning>
        {/* Page Header */}
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Inventory Report
          </h1>
        </div>

        {/* Main Data Container (Branch Sidebar + Right Main Content) */}
        <Suspense
          fallback={
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-72 lg:w-80 h-[500px] bg-slate-100 animate-pulse rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-32 bg-slate-100 animate-pulse rounded-xl" />
                <TableSkeleton columns={8} rows={8} />
              </div>
            </div>
          }
        >
          <InventoryReportsData searchParams={searchParams} />
        </Suspense>
      </div>
    </PermissionGuard>
  );
}
