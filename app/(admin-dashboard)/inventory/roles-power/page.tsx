import RolesPowerData from "@/components/inventory/roles-power/RolesPowerData";
import RolesPowerFilterData from "@/components/inventory/roles-power/RolesPowerFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function RolesPowerPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Roles Power
                </h1>

                <PermissionGuard requiredPermission="create-roles-power">
                    <Button asChild>
                        <Link href="/inventory/roles-power/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Step
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <RolesPowerFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <RolesPowerData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
