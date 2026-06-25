import GroupItemsData from "@/components/inventory/inventory-groups/GroupItemsData";
import GroupItemsFilterData from "@/components/inventory/inventory-groups/GroupItemsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import GroupsSummaryWrapper from "@/components/inventory/GroupsSummaryWrapper";

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

            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                }
            >
                <GroupsSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <GroupItemsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <GroupItemsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
