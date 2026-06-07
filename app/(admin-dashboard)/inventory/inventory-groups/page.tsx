import GroupItemsData from "@/components/inventory/inventory-groups/GroupItemsData";
import GroupItemsFilterData from "@/components/inventory/inventory-groups/GroupItemsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function InventoryGroupsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Group Items</h1>

                <PermissionGuard requiredPermission="create-group-items">
                    <Button asChild className="">
                        <Link href="/inventory/inventory-groups/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Group Item
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <GroupItemsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <GroupItemsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
