import RoomsData from "@/components/inventory/inventory-rooms/RoomsData";
import RoomsFilterData from "@/components/inventory/inventory-rooms/RoomsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import RoomsSummaryWrapper from "@/components/inventory/RoomsSummaryWrapper";

export default function InventoryRoomsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Inventory Rooms</h1>

                <PermissionGuard requiredPermission="create-rooms">
                    <Button asChild>
                        <Link href="/inventory/inventory-rooms/add" className="cursor-pointer">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Room
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
                <RoomsSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <RoomsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
                <RoomsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
