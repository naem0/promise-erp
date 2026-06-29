import RequisitionsData from "@/components/inventory/requisitions/RequisitionsData";
import RequisitionsFilterData from "@/components/inventory/requisitions/RequisitionsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function RequisitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Requisitions
        </h1>

        <PermissionGuard requiredPermission="create-requisitions">
          <Button asChild className="">
            <Link href="/inventory/requisitions/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Requisition
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <RequisitionsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <RequisitionsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
