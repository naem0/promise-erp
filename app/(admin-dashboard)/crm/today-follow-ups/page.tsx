import TodayFollowUpsData from "@/components/crm/today-follow-ups/TodayFollowUpsData";
import TodayFollowUpsFilterData from "@/components/crm/today-follow-ups/TodayFollowUpsFilterData";
import TodayFollowUpsSummaryWrapper from "@/components/crm/today-follow-ups/TodayFollowUpsSummaryWrapper";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import LeadsActivitySummaryWrapper from "@/components/crm/lead-activities/LeadActivitiesSummaryWrapper";

export default function TodayFollowUpsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <PermissionGuard requiredPermission={["view-lead-activity-list", "view-assigned-lead-activity-list"]} mode="any">
            <div className="mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Today {`'`}s Leads</h1>
                </div>

                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
                    ))}
                </div>}>
                    <LeadsActivitySummaryWrapper />
                </Suspense>

                <TodayFollowUpsFilterData />

                <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                    <TodayFollowUpsData searchParams={searchParams} />
                </Suspense>
            </div>
        </PermissionGuard>
    );
}
