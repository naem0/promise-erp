import CoursesData from "@/components/lms/courses/CoursesData";
import NextAuthGuardWrapper from "@/components/auth/NextAuthGuardWrapper";
import CourseFilterData from "@/components/lms/courses/CourseFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <NextAuthGuardWrapper requiredPermissions={["view-courses","view-batches"]}>
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <PermissionGuard requiredPermission="create-courses">
            <Button asChild>
              <Link href="/lms/courses/add">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Course
                </Link>  
                </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <CourseFilterData />
        </Suspense>

        {/* Table */}
        <Suspense fallback={<TableSkeleton rows={10} columns={8} />}>
          <CoursesData searchParams={searchParams} />
        </Suspense>
      </div>
    </NextAuthGuardWrapper>
  );
}
