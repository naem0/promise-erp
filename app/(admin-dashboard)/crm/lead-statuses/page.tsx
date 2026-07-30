import { Suspense } from "react";
import LeadStatusesData from "@/components/crm/lead-statuses/LeadStatusesData";
import LeadStatusesFilterData from "@/components/crm/lead-statuses/LeadStatusesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function LeadStatusesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Lead Statuses
          </h1>

          <PermissionGuard requiredPermission="create-crm-statuses">
            <Button asChild className="">
              <Link href="/crm/lead-statuses/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Status
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div className="text-2xl text-center font-bold py-4">Loading filters...</div>}>
          <LeadStatusesFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <LeadStatusesData searchParams={searchParams} />
        </Suspense>
      </div>
  );
}
