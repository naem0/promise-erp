import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil } from "lucide-react";
import { getCourses } from "@/apiServices/courseService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import AssignBranchesButton from "./AssignBranchesButton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

// NOTE: This list is rendered as a CSS-grid of <div>s instead of a
// <table>/<tr>/<td>. React MUST stream a <table> cell-by-cell via the $RS
// segment mechanism (a half-built <tr> is invalid HTML), and on this
// data-heavy page those cell-segment ids collide with the prerendered layout
// shell's Suspense-boundary id under cacheComponents PPR — throwing
// HierarchyRequestError in the $RV reveal / React #418. A <div> grid streams
// inline (a partial <div> is valid), so it emits no $RS cell-segments and
// nothing collides. See [[nextjs-ppr-table-segment-collision]].

const HEADER_CELL =
  "flex h-10 items-center bg-muted/40 px-2 font-medium text-muted-foreground";
const CELL = "flex items-center border-t px-2 py-2 group-hover:bg-muted/50";

export default async function CoursesData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const per_page =
    typeof resolvedSearchParams.per_page === "string"
      ? Number(resolvedSearchParams.per_page)
      : 15;

  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    level:
      typeof resolvedSearchParams.level === "string"
        ? resolvedSearchParams.level
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    category_id:
      typeof resolvedSearchParams.category_id === "string"
        ? resolvedSearchParams.category_id
        : undefined,
  };

  let data;
  try {
    data = await getCourses(params);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!data?.success || !data?.data ) {
    return <ErrorComponent message={data?.message || "Failed to fetch courses."} />;
  }

  const courses = data?.data?.courses || [];
  const pagination = data?.data?.pagination;

  if (courses?.length === 0) {
    return <NotFoundComponent message={data?.message} title="Course List" />;
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <div
          role="table"
          className="grid w-full min-w-[900px] grid-cols-[auto_auto_minmax(180px,1fr)_auto_auto_auto_auto_auto_auto_auto_auto] text-sm"
        >
          {/* Header */}
          <div role="row" className="contents">
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Sl</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Action</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-start`}>Course</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-end`}>Price</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Category</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Ratings</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Level</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Seats</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Enrolled</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Branches</div>
            <div role="columnheader" className={`${HEADER_CELL} justify-center`}>Status</div>
          </div>

          {/* Rows */}
          {courses.map((course, index) => (
            <div role="row" key={course.id} className="group contents">
              <div role="cell" className={`${CELL} justify-center`}>
                {(page - 1) * per_page + (index + 1)}
              </div>

              {/* Action Dropdown */}
              <div role="cell" className={`${CELL} justify-center`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant="default"
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer select-none"
                    >
                      Action
                    </Badge>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center">
                    <DropdownMenuItem asChild>
                      <Link href={`/courses/${course.slug}`}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Link>
                    </DropdownMenuItem>

                    <PermissionGuard requiredPermission="edit-courses">
                      <DropdownMenuItem asChild>
                        <Link href={`/lms/courses/${course.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" /> Manage
                        </Link>
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="delete-courses">
                      <DropdownMenuItem asChild>
                        <DeleteButton id={course.id} />
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="assign-course-branches">
                      <AssignBranchesButton
                        courseId={String(course.id)}
                        initialAssignedBranches={course.branches}
                      />
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Course Info */}
              <div role="cell" className={`${CELL} justify-start`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-md border text-center">
                    <Image
                      src={
                        course.featured_image || "/images/placeholder_img.jpg"
                      }
                      alt={course.title}
                      width={40}
                      height={40}
                      className="object-cover w-10 h-10"
                    />
                  </div>
                  <div className="text-start min-w-0">
                    <p className="font-medium truncate" title={course.title}>
                      {truncate(course.title || "", 40)}
                    </p>
                    {course.latest_batch && (
                      <p className="text-xs text-blue-600 font-semibold mt-1 truncate">
                        Latest: {course.latest_batch.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div
                role="cell"
                className="flex flex-col items-end justify-center border-t px-2 py-2 group-hover:bg-muted/50"
              >
                {Number(course.discount) > 0 && (
                  <small className="text-gray-500 block">
                    <del>{Number(course.price).toFixed(2)} ৳</del>
                  </small>
                )}
                <span className="font-semibold text-primary">
                  {course.after_discount
                    ? Number(course.after_discount).toFixed(2)
                    : (
                        Number(course.price) - Number(course.discount)
                      ).toFixed(2)}{" "}
                  ৳
                </span>
              </div>

              <div role="cell" className={`${CELL} justify-center text-center`}>
                {course.category?.name || "N/A"}
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">
                    {course.ratings
                      ? Number(course.ratings).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                <Badge
                  variant="secondary"
                  className={`capitalize ${
                    course.level === "beginner"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : course.level === "intermediate"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                  }`}
                >
                  {course.level}
                </Badge>
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                {course.total_seats}
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                {course.total_enrolled}
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                {course.branch_count || 0}
              </div>

              <div role="cell" className={`${CELL} justify-center`}>
                {course.status === "Published" ? (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Published
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-gray-200 text-gray-700"
                  >
                    {course.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pagination && pagination?.last_page > 1 && (
        <div className="mt-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
}
