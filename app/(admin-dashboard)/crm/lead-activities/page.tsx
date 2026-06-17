import LeadsActivityFilterData from "@/components/crm/lead-activities/LeadActivitiesFilterData";
import LeadsActivitySummaryWrapper from "@/components/crm/lead-activities/LeadActivitiesSummaryWrapper";
import LeadActivitiesTableSection from "@/components/crm/lead-activities/LeadActivitiesTableSection";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function LeadsActivityPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <PermissionGuard requiredPermission={["view-lead-activity-list", "view-assigned-lead-activity-list"]} mode="any">
            <div className="mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Lead Activities</h1>
                </div>

                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>
                    ))}
                </div>}>
                    <LeadsActivitySummaryWrapper />
                </Suspense>

                <LeadsActivityFilterData />
                <LeadActivitiesTableSection searchParams={searchParams} />
            </div>
        </PermissionGuard>
    );
}

