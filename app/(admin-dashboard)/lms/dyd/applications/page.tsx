import DydApplicationsData from "@/components/lms/dyd/applications/DydApplicationsData";
import DydApplicationsFilterData from "@/components/lms/dyd/applications/DydApplicationsFilterData";
import DydApplicationsSummaryWrapper from "@/components/lms/dyd/applications/DydApplicationsSummaryWrapper";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";

export default function DydApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          DYD Applications
        </h1>
      </div>

      <Suspense fallback={<div>Loading summary...</div>}>
        <DydApplicationsSummaryWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <DydApplicationsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <DydApplicationsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
