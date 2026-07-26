
import BatchesData from "@/components/lms/batches/BatchesData";
import BatchFilterData from "@/components/lms/batches/BatchFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";
import BatchesSummaryWrapper from "@/components/lms/batches/BatchesSummaryWrapper";

export default async function BatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Batches</h1>
        <PermissionGuard requiredPermission="create-batches">
          <Button asChild>
            <Link href="/lms/batches/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Batch
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense
          fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-slate-400 animate-pulse rounded-xl"></div>
                  ))}
              </div>
          }
      >
          <BatchesSummaryWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <BatchFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <BatchesData searchParams={params} />
      </Suspense>
    </div>
  );
}
