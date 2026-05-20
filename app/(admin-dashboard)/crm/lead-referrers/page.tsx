import ReferrersData from "@/components/crm/lead-referrers/ReferrersData";
import ReferrersFilterData from "@/components/crm/lead-referrers/ReferrersFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function LeadReferrersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Lead Referrers</h1>

                <PermissionGuard requiredPermission="create-crm-referrers">
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                        <Link href="/crm/lead-referrers/add" prefetch={true}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Referrer
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <ReferrersFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={12} rows={10} />}>
                <ReferrersData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
