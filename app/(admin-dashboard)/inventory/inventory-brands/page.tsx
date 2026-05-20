import BrandsData from "@/components/inventory/inventory-brands/BrandsData";
import BrandsFilterData from "@/components/inventory/inventory-brands/BrandsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function InventoryBrandsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Brands</h1>

                <PermissionGuard requiredPermission="create-brands">
                    <Button asChild className="">
                        <Link href="/inventory/inventory-brands/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Brand
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <BrandsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
                <BrandsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
