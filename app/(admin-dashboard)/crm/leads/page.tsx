import CRMLeadsData from "@/components/crm/leads/CRMLeadsData";
import CRMLeadsFilterData from "@/components/crm/leads/CRMLeadsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import CRMLeadsImportButton from "@/components/crm/leads/CRMLeadsImportButton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import LeadsActivitySummaryWrapper from "@/components/crm/lead-activities/LeadActivitiesSummaryWrapper";

export default function CRMLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Leads
        </h1>
        <div className="flex justify-end items-center gap-3 pt-4">
          <PermissionGuard requiredPermission="import-leads">
            <CRMLeadsImportButton />
          </PermissionGuard>
          <PermissionGuard requiredPermission="create-leads">
            <Button asChild className="bg-green-600">
              <Link href="/crm/leads/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Lead
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        }
      >
        <LeadsActivitySummaryWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <CRMLeadsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <CRMLeadsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
