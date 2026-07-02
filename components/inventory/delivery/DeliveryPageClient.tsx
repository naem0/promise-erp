"use client";

import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeliveryFilter from "./DeliveryFilter";
import DeliveryTable from "./DeliveryTable";
import { DeliveriesResponse } from "@/apiServices/inventoryBrandsService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface DeliveryPageClientProps {
  deliveriesList: DeliveriesResponse | null;
}

export default function DeliveryPageClient({ deliveriesList }: DeliveryPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedIds((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const deliveries = deliveriesList?.data?.deliveries || [];
  const paginationData = deliveriesList?.data?.pagination || undefined;

  const hasSelection = selectedIds.size > 0;
  
  // Create navigation link containing all selected ID parameters
  const firstSelectedId = Array.from(selectedIds)[0];
  const selectedIdsParam = Array.from(selectedIds).join(",");
  const deliveryUrl = firstSelectedId 
    ? `/inventory/delivery/${firstSelectedId}/shipping?ids=${selectedIdsParam}`
    : "#";

  if (deliveries.length === 0) {
    return (
      <div className="mx-auto">
        <NotFoundComponent message="No deliveries found." />
      </div>
    );
  }

  if (!deliveriesList || !deliveriesList.data) {
    return null;
  }

  return (
    <div className="mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="flex justify-between items-center bg-card p-4 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Delivery
          </h1>
        </div>

        {hasSelection ? (
          <Button
            className="cursor-pointer bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center gap-2"
            asChild
          >
            <Link href={deliveryUrl}>
              <Truck className="w-4 h-4" />
              Delivery
            </Link>
          </Button>
        ) : (
          <Button
            className="cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-600 dark:hover:bg-slate-800 flex items-center gap-2"
            disabled
          >
            <Truck className="w-4 h-4" />
            Delivery
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <DeliveryFilter />

      {/* Table Section */}
        <DeliveryTable 
          deliveries={deliveries} 
          paginationData={paginationData}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />

    </div>
  );
}
