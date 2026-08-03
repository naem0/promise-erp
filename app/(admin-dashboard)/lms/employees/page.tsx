import EmployeesData from "@/components/lms/employees/EmployeesData";
import EmployeesFilterData from "@/components/lms/employees/EmployeesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";
import EmployeesSummaryWrapper from "@/components/lms/employees/EmployeesSummaryWrapper";
import EmployeeExportButton from "@/components/lms/employees/EmployeeExportButton";

export default function EmployeesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Employees</h1>

                <div className="flex items-center gap-2">
                    <Suspense fallback={null}>
                        <EmployeeExportButton />
                    </Suspense>

                    <PermissionGuard requiredPermission="create-employees">
                        <Button asChild className="bg-green-600">
                            <Link href="/lms/employees/add">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Employee
                            </Link>
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-400 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                }
            >
                <EmployeesSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <EmployeesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
                <EmployeesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
