import StudentEarningsData from "@/components/lms/student-earnings/StudentEarningsData";
import StudentEarningsFilterData from "@/components/lms/student-earnings/StudentEarningsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function StudentEarningsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Student Earnings
                </h1>

                <PermissionGuard requiredPermission="create-student-earnings">
                    <Button asChild>
                        <Link href="/lms/student-earnings/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Earning
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <StudentEarningsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={11} rows={10} />}>
                <StudentEarningsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
