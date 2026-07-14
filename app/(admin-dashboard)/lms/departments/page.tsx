import { Suspense } from "react";
import DepartmentsData from "@/components/lms/departments/DepartmentsData";
import DepartmentsFilterData from "@/components/lms/departments/DepartmentsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Departments
          </h1>

          <PermissionGuard requiredPermission="create-departments">
            <Button asChild className="">
              <Link href="/lms/departments/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Department
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <DepartmentsFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
          <DepartmentsData searchParams={searchParams} />
        </Suspense>
      </div>
  );
}
