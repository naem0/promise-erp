import TeachersData from "@/components/lms/teachers/TeachersData";
import TeacherFilterData from "@/components/lms/teachers/TeacherFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
          <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Teachers</h1>
          <PermissionGuard requiredPermission="create-teachers">
            <Button asChild>
              <Link href="/lms/teachers/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Teacher
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <TeacherFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
          <TeachersData searchParams={params} />
        </Suspense>
      </div>
      );
}
