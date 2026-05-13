import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Suspense } from "react";
import CRMLeadReportsData from "@/components/crm/lead-reports/CRMLeadReportsData";
import CRMLeadReportsSummaryWrapper from "@/components/crm/lead-reports/CRMLeadReportsSummaryWrapper";
import CRMLeadReportsFilterData from "@/components/crm/lead-reports/CRMLeadReportFilterData";


export default function CRMLeadsReportPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <PermissionGuard requiredPermission="crm-lead-reports">
            <div className="mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Lead Reports</h1>
                </div>

                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 w-full animate-pulse bg-slate-100 rounded-xl" />
                    ))}
                </div>}>
                    <CRMLeadReportsSummaryWrapper />
                </Suspense>

                <Suspense fallback={<div className="h-32 w-full animate-pulse bg-slate-100 rounded-xl" />}>
                    <CRMLeadReportsFilterData />
                </Suspense>

                <Suspense fallback={<TableSkeleton columns={12} rows={10} />}>
                    <CRMLeadReportsData searchParams={searchParams} />
                </Suspense>
            </div>
        </PermissionGuard>
    );
}
