import { Suspense } from "react";
import DeliveryTypesData from "@/components/inventory/inventory-delivery-types/DeliveryTypesData";
import DeliveryTypesFilter from "@/components/inventory/inventory-delivery-types/DeliveryTypesFilter";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function InventoryDeliveryTypesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Delivery Types
                </h1>

                <PermissionGuard requiredPermission="create-delivery-types">
                    <Button asChild className="cursor-pointer">
                        <Link href="/inventory/inventory-delivery-types/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Delivery Type
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <DeliveryTypesFilter />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
                <DeliveryTypesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
