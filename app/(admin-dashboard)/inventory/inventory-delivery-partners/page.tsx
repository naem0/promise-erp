import DeliveryPartnersData from "@/components/inventory/inventory-delivery-partners/DeliveryPartnersData";
import DeliveryPartnersFilter from "@/components/inventory/inventory-delivery-partners/DeliveryPartnersFilter";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeliveryPartnersSummaryWrapper from "@/components/inventory/DeliveryPartnersSummaryWrapper";

export default function InventoryDeliveryPartnersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Delivery Partners</h1>

                <PermissionGuard requiredPermission="create-delivery-partners">
                    <Button asChild className="cursor-pointer">
                        <Link href="/inventory/inventory-delivery-partners/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Partner
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-400 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                }
            >
                <DeliveryPartnersSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <DeliveryPartnersFilter />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <DeliveryPartnersData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
