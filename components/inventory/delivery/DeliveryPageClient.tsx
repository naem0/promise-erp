"use client";

import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeliveryFilter from "./DeliveryFilter";
import DeliveryTable from "./DeliveryTable";
import { DeliveriesResponse } from "@/apiServices/inventoryBrandsService";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface DeliveryPageClientProps {
  deliveriesList: DeliveriesResponse | null;
}

export default function DeliveryPageClient({ deliveriesList }: DeliveryPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedIds((prev) => (prev.size === 0 ? prev : new Set()));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const deliveries = deliveriesList?.data?.deliveries || [];
  const paginationData = deliveriesList?.data?.pagination || undefined;

  const hasSelection = selectedIds.size > 0;
  
  // Create navigation link containing all selected ID parameters
  const selectedIdsParam = Array.from(selectedIds).join(",");
  const deliveryUrl = selectedIds.size > 0 
    ? `/inventory/delivery/bulk/shipping?ids=${selectedIdsParam}`
    : "#";

  if (!deliveriesList || !deliveriesList.data) {
    return null;
  }

  return (
    <PermissionGuard requiredPermission="view-deliveries">
      <div className="mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="flex justify-between items-center bg-card p-4 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Delivery
            </h1>
          </div>

          <PermissionGuard requiredPermission="create-deliveries">
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
          </PermissionGuard>
        </div>

        {/* Filter Section */}
        <DeliveryFilter />

        {/* Table Section */}
        {deliveries.length === 0 ? (
          <div className="mx-auto">
            <NotFoundComponent message="No deliveries found." />
          </div>
        ) : (
          <DeliveryTable 
            deliveries={deliveries} 
            paginationData={paginationData}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        )}

      </div>
    </PermissionGuard>
  );
}
