import CoursesData from "@/components/lms/courses/CoursesData";
import CourseFilterData from "@/components/lms/courses/CourseFilterData";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import PermissionGuard from "@/components/auth/PermissionGuard";
import CoursesSummaryWrapper from "@/components/lms/courses/CoursesSummaryWrapper";

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

      {/* Summary Cards */}
      <CoursesSummaryWrapper />

      {/*
        NO page-level <Suspense> here on purpose. The dynamic filter + table
        suspend up to the dashboard layout's single SidebarInset boundary.

        Why: the $RV/HierarchyRequestError + React #418 crash needs a request-
        revealed Suspense boundary whose segment id ("S:N") collides with a
        streamed table row-segment ($RS), which are numbered from S:2 upward.
        Any page-level boundary here (filter, table) completes first and takes
        S:0/S:1, which pushes the PARENT layout boundary up to S:2+ — exactly
        where the row-segments land, so it collides. Removing all page-level
        boundaries leaves the layout boundary as the only revealed one, at a
        low number below where the segments start, so no id is ever shared.
        (Verified via a minimal repro; see memory nextjs-ppr-table-segment-
        collision. Durable cure is Next 16.3, which stops emitting the $RS
        row-segments entirely.)
      */}
      <CourseFilterData />
      <CoursesData searchParams={searchParams} />
    </div>
  );
}
