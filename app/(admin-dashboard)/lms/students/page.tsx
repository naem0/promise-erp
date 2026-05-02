import StudentsData from "@/components/lms/students/StudentsData";
import StudentFilterData from "@/components/lms/students/StudentFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";
import StudentsSummaryWrapper from "@/components/lms/students/StudentsSummaryWrapper";

export default function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
        <PermissionGuard requiredPermission="create-students">
          <Button asChild>
            <Link href="/lms/students/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Student
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading summary...</div>}>
        <StudentsSummaryWrapper searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <StudentFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <StudentsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
