import CoursesData from "@/components/lms/courses/CoursesData";
import CourseFilterData from "@/components/lms/courses/CourseFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
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

        {/*
          Filter + table share ONE Suspense boundary on purpose. This page is
          the only admin route that adds its own boundaries on top of the
          layout's; with two of them, React assigns a boundary the "S:2"
          segment id — the same id it gives the first streamed <table>
          cell-segment ($RS) — and the duplicate id corrupts the tree in the
          $RV reveal (HierarchyRequestError / React #418). Collapsing to a
          single boundary keeps the page's boundary ids at S:0/S:1, below
          where the table segments start (S:2), so there is no collision.
        */}
        <Suspense
          fallback={
            <>
              <div>Loading filters...</div>
              <TableSkeleton rows={10} columns={8} />
            </>
          }
        >
          <CourseFilterData />
          <CoursesData searchParams={searchParams} />
        </Suspense>
      </div>
      );
}
