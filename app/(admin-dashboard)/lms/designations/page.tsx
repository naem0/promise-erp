import DesignationsData from "@/components/lms/designations/DesignationsData";
import DesignationsFilterData from "@/components/lms/designations/DesignationsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";


export default function DesignationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Designations</h1>

                <PermissionGuard requiredPermission="create-designations">
                    <Button asChild className="bg-green-600">
                        <Link href="/lms/designations/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Designation
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <DesignationsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
                <DesignationsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
