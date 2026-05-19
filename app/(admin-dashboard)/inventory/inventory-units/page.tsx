import UnitsData from "@/components/inventory/inventory-units/UnitsData";
import UnitsFilterData from "@/components/inventory/inventory-units/UnitsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function InventoryUnitsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Units</h1>

                <PermissionGuard requiredPermission="create-units">
                    <Button asChild className="">
                        <Link href="/inventory/inventory-units/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Unit
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <UnitsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
                <UnitsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
