import CRMLeadsReportData from "@/components/crm/leads-report/CRMLeadsReportData";
import CRMLeadsReportFilterData from "@/components/crm/leads-report/CRMLeadsReportFilterData";
import CRMLeadsReportSummaryWrapper from "@/components/crm/leads-report/CRMLeadsReportSummaryWrapper";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Suspense } from "react";


export default function CRMLeadsReportPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <PermissionGuard requiredPermission="crm-lead-reports">
            <div className="mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Leads Report</h1>
                </div>

                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 w-full animate-pulse bg-slate-100 rounded-xl" />
                    ))}
                </div>}>
                    <CRMLeadsReportSummaryWrapper />
                </Suspense>

                <Suspense fallback={<div className="h-32 w-full animate-pulse bg-slate-100 rounded-xl" />}>
                    <CRMLeadsReportFilterData />
                </Suspense>

                <Suspense fallback={<TableSkeleton columns={12} rows={10} />}>
                    <CRMLeadsReportData searchParams={searchParams} />
                </Suspense>
            </div>
        </PermissionGuard>
    );
}
