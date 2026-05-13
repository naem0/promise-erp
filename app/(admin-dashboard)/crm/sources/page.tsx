import CRMSourcesData from "@/components/crm/sources/CRMSourcesData";
import CRMSourcesFilter from "@/components/crm/sources/CRMSourcesFilter";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CRMSourcesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Lead Sources</h1>
                <div className="flex justify-end items-center gap-3 pt-4">
                    <PermissionGuard requiredPermission="create-crm-sources">
                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white cursor-pointer rounded-lg">
                            <Link href="/crm/sources/add">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Source
                            </Link>
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <CRMSourcesFilter />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <CRMSourcesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
