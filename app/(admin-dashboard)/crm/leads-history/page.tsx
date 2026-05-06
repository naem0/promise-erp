import LeadsHistoryData from "@/components/crm/leads-history/LeadsHistoryData";
import LeadsHistoryFilterData from "@/components/crm/leads-history/LeadsHistoryFilterData";
import LeadsHistorySummaryWrapper from "@/components/crm/leads-history/LeadsHistorySummaryWrapper";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";

export default function LeadsHistoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Leads Activity</h1>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
                ))}
            </div>}>
                <LeadsHistorySummaryWrapper searchParams={searchParams} />
            </Suspense>

            <LeadsHistoryFilterData />

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <LeadsHistoryData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
