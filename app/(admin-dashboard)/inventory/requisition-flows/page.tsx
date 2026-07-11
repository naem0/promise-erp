import { Metadata } from "next";
import { Suspense } from "react";
import RequisitionFlowsData from "@/components/inventory/requisition-flows/RequisitionFlowsData";
import RequisitionFlowsFilterData from "@/components/inventory/requisition-flows/RequisitionFlowsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Requisition Flows | Promise ERP",
};

export default function RequisitionFlowsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Requisition Flows
        </h1>

        <PermissionGuard requiredPermission="create-requisition-flows">
          <Button asChild>
            <Link href="/inventory/requisition-flows/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Requisition Flow
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <RequisitionFlowsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
        <RequisitionFlowsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
