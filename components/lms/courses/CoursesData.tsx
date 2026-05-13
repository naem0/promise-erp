import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil } from "lucide-react";
import { getCourses } from "@/apiServices/courseService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import AssignBranchesButton from "./AssignBranchesButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default async function CoursesData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;

  const params = {
    page,
    per_page,
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    sort_order: typeof resolvedSearchParams.sort_order === "string" ? resolvedSearchParams.sort_order : undefined,
    level: typeof resolvedSearchParams.level === "string" ? resolvedSearchParams.level : undefined,
    branch_id: typeof resolvedSearchParams.branch_id === "string" ? resolvedSearchParams.branch_id : undefined,
    category_id: typeof resolvedSearchParams.category_id === "string" ? resolvedSearchParams.category_id : undefined,
  };

  let data;
  try {
    data = await getCourses(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const courses = data.data.courses;
  const pagination = data.data.pagination;
  console.log("CoursesData - Fetched pagination:", pagination);


  if (courses.length === 0) {
    return <NotFoundComponent message={data?.message} title="Course List" />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead className="text-center">Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-start">Course</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Ratings</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Seats</TableHead>
              <TableHead className="text-center">Enrolled</TableHead>
              <TableHead className="text-center">Branches</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell className="text-center">{(page - 1) * 15 + (index + 1)}</TableCell>

                {/* Action Dropdown */}
                <TableCell className="text-center">
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
                      {/* <DropdownMenuItem asChild>
                        <Link href={`/lms/courses/${course.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Details
                        </Link>
                      </DropdownMenuItem> */}

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
                </TableCell>

                {/*  Course Info */}
                <TableCell className="text-center">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 overflow-hidden rounded-md border text-center" >
                      <Image
                        src={course.featured_image || "/images/placeholder_img.jpg"}
                        alt={course.title}
                        fill
                        className="object-scale-cover"
                      />
                    </div>
                    <div className="text-start">
                      <p className="font-medium">{course.title}</p>
                      {course.latest_batch && (
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          Latest: {course.latest_batch.name}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-end">
                  {Number(course.discount) > 0 && (
                    <small className="text-gray-500 block">
                      <del>{Number(course.price).toFixed(2)} ৳</del>
                    </small>
                  )}
                  <span className="font-semibold text-primary">
                    {course.after_discount ? Number(course.after_discount).toFixed(2) : (Number(course.price) - Number(course.discount)).toFixed(2)} ৳
                  </span>
                </TableCell>

                <TableCell className="text-center">{course.category?.name || "N/A"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{course.ratings ? Number(course.ratings).toFixed(2) : "0.00"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={`capitalize ${course.level === "beginner"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : course.level === "intermediate"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                      }`}
                  >
                    {course.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{course.total_seats}</TableCell>
                <TableCell className="text-center">{course.total_enrolled}</TableCell>
                <TableCell className="text-center">{course.branch_count || 0}</TableCell>

                <TableCell className="text-center">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination?.last_page > 1  && (
        <div className="mt-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
}
