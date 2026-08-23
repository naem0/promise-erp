import EarningSitesData from "@/components/lms/earning-sites/EarningSitesData";
import EarningSiteFilterData from "@/components/lms/earning-sites/EarningSiteFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function EarningSitesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Earning Sites
                </h1>

                <PermissionGuard requiredPermission="create-earning-sites">
                    <Button asChild>
                        <Link href="/lms/earning-sites/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Earning Site
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <EarningSiteFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={4} rows={10} />}>
                <EarningSitesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
