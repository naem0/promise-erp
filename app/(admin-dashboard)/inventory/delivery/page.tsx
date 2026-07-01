import { ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeliveryFilter from "@/components/inventory/delivery/DeliveryFilter";
import DeliveryTable from "@/components/inventory/delivery/DeliveryTable";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";

export default function DeliveryPage() {
  return (
    <div className="mx-auto space-y-6 max-w-[1600px]">
      {/* Top Header Card */}
      <div className="flex justify-between items-center bg-card p-4 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Delivery
          </h1>
        </div>

        <Button
          className="cursor-pointer"
          asChild
        >
          <Link href="#">
            <Truck className="w-4 h-4" />
            Delivery
          </Link>
        </Button>
      </div>

      {/* Filter Section */}
      <DeliveryFilter />

      {/* Table Section */}
      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <DeliveryTable />
      </Suspense>
    </div>
  );
}
