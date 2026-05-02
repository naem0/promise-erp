import ConsultantsPerformanceData from "@/components/crm/consultants-performance/ConsultantsPerformanceData";
import ConsultantsPerformanceFilterData from "@/components/crm/consultants-performance/ConsultantsPerformanceFilterData";
import ConsultantsPerformanceSummaryWrapper from "@/components/crm/consultants-performance/ConsultantsPerformanceSummaryWrapper";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";

export default function ConsultantsPerformancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Counsellor Performance</h1>
            </div>

            <Suspense fallback={<div>Loading summary...</div>}>
                <ConsultantsPerformanceSummaryWrapper searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <ConsultantsPerformanceFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={12} rows={10} />}>
                <ConsultantsPerformanceData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
