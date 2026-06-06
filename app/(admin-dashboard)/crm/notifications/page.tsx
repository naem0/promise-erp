import CRMNotificationsData from "@/components/crm/notifications/CRMNotificationsData";
import CRMNotificationsFilterData from "@/components/crm/notifications/CRMNotificationsFilterData";
import CRMNotificationsStatsData, { CRMNotificationsStatsSkeleton } from "@/components/crm/notifications/CRMNotificationsStatsData";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";

export default function CRMNotificationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                    Notifications
                </h1>
            </div>

            <Suspense fallback={<CRMNotificationsStatsSkeleton />}>
                <CRMNotificationsStatsData searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<div className="h-28 animate-pulse bg-slate-100 rounded-xl mb-6 border" />}>
                <CRMNotificationsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={1} rows={8} />}>
                <CRMNotificationsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
