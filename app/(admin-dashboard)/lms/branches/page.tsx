import BranchesData from "@/components/lms/branches/BranchesData";
import BranchFilterData from "@/components/lms/branches/BranchFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function BranchesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Branches</h1>

                <PermissionGuard requiredPermission="create-branches">
                    <Button asChild className="bg-green-600">
                        <Link href="/lms/branches/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Branch
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <BranchFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={11} rows={10} />}>
                <BranchesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
