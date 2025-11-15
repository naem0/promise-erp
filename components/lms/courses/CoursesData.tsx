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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getCourses } from "@/apiServices/courseService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function CoursesData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;

  const params = {
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    sort_order: typeof resolvedSearchParams.sort_order === "string" ? resolvedSearchParams.sort_order : undefined,
    level: typeof resolvedSearchParams.level === "string" ? resolvedSearchParams.level : undefined,
    division_id: typeof resolvedSearchParams.division_id === "string" ? resolvedSearchParams.division_id : undefined,
    branch_id: typeof resolvedSearchParams.branch_id === "string" ? resolvedSearchParams.branch_id : undefined,
    category_id: typeof resolvedSearchParams.category_id === "string" ? resolvedSearchParams.category_id : undefined,
  };

  let data;
  try {
    data = await getCourses(page, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const courses = data.data.courses;
  const pagination = data.data.pagination;

  if (courses.length === 0) {
    return <NotFoundComponent message="No courses found." />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Branches</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell>{index + 1}</TableCell>

                {/* 🔹 Action Dropdown */}
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/courses/${course?.id}`}
                          className="flex items-center cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/courses/${course?.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteButton id={course?.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                {/* 🔹 Course Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 overflow-hidden rounded-md border">
                      <Image
                        src={
                          course.featured_image
                            ? `http://127.0.0.1:8003/${course.featured_image}`
                            : "/placeholder.png"
                        }
                        alt={course.title}
                        height={80}
                        width={80}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.sub_title}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <small><del>{course.price} ৳</del></small> <br />
                  {course.price - course.discount} ৳
                </TableCell>

                <TableCell>{course.category?.name || "N/A"}</TableCell>
                <TableCell>{course.level || "N/A"}</TableCell>
                <TableCell>{course.total_enrolled}</TableCell>
                <TableCell>{course.branch_count || 0}</TableCell>

                <TableCell>
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
      <Pagination pagination={pagination} />
    </>
  );
}
