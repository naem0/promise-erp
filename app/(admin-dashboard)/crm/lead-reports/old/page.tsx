import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Suspense } from "react";
import CRMOldLeadReportsData from "@/components/crm/lead-reports/old/CRMOldLeadReportsData";
import CRMLeadReportsFilterData from "@/components/crm/lead-reports/CRMLeadReportFilterData";
import CRMLeadReportsSummaryWrapper from "@/components/crm/lead-reports/CRMLeadReportsSummaryWrapper";



export default function CRMOldLeadsReportPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <PermissionGuard requiredPermission="crm-old-reports-list">
            <div className="mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Old Leads Report</h1>
                      
                    </div>
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

                <Suspense fallback={<TableSkeleton columns={15} rows={10} />}>
                    <CRMOldLeadReportsData searchParams={searchParams} />
                </Suspense>
            </div>
        </PermissionGuard>
    );
}
