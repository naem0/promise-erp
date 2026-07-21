import SchedulesData from "@/components/lms/class-schedules/SchedulesData";
import SchedulesFilterData from "@/components/lms/class-schedules/SchedulesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ClassSchedulesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Class Schedules</h1>

                <PermissionGuard requiredPermission="create-class-schedules">
                    <Button asChild>
                        <Link href="/lms/class-schedules/add" className="cursor-pointer">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Schedule
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <SchedulesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
                <SchedulesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
