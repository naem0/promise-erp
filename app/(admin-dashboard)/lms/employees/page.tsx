import EmployeesData from "@/components/lms/employees/EmployeesData";
import EmployeesFilterData from "@/components/lms/employees/EmployeesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function EmployeesPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Employees</h1>

                <Button asChild className="bg-green-600">
                    <Link href="/lms/employees/add">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Employee
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <EmployeesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
                <EmployeesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
