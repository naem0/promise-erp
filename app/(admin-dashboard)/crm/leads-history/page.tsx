import LeadsHistoryData from "@/components/crm/leads-history/LeadsHistoryData";
import LeadsHistoryFilterData from "@/components/crm/leads-history/LeadsHistoryFilterData";
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
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Leads History</h1>
            </div>

            <LeadsHistoryFilterData />

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <LeadsHistoryData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
