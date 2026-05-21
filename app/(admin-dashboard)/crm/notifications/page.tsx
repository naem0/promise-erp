import CRMNotificationsData from "@/components/crm/notifications/CRMNotificationsData";
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

            <Suspense fallback={<TableSkeleton columns={1} rows={8} />}>
                <CRMNotificationsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
