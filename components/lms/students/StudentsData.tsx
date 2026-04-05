
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { getStudents, Student } from "@/apiServices/studentService";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const StudentsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    is_govt:
      typeof resolvedSearchParams.is_govt === "string"
        ? resolvedSearchParams.is_govt
        : undefined,
    is_blocked:
      typeof resolvedSearchParams.is_blocked === "string"
        ? resolvedSearchParams.is_blocked
        : undefined,
    division_id:
      typeof resolvedSearchParams.division_id === "string"
        ? resolvedSearchParams.division_id
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    course_id:
      typeof resolvedSearchParams.course_id === "string"
        ? resolvedSearchParams.course_id
        : undefined,
  };

  let results;
  try {
    results = await getStudents(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const students = results?.data?.students || [];
  const paginationData = results?.data?.pagination;

  if (!students.length) {
    return <NotFoundComponent message={results?.message || "No students found."} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Profile</TableHead>
            <TableHead className="text-center">Name & Email</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-center">Courses & Batches</TableHead>
            <TableHead className="text-center">Branch</TableHead>
            <TableHead className="text-center">Divisions</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student: Student, index: number) => (
            <TableRow key={student?.id}>
              <TableCell className="text-center">{(page - 1) * 15 + (index + 1)}</TableCell>
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
                    <PermissionGuard requiredPermission="view-students">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/students/${student?.id}`}
                          className="flex items-center cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Link>
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="edit-students">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/students/${student?.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="delete-students">
                      <DropdownMenuItem asChild>
                        <DeleteButton id={student?.id} />
                      </DropdownMenuItem>
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Avatar className="h-8 w-8 bg-gray-300 rounded-full overflow-hidden">
                    <AvatarImage
                      src={student?.profile_image || "/images/profile_avatar.png"}
                      alt={student?.name}
                    />
                  </Avatar>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{student?.name}</p>
                  <p className="text-xs text-muted-foreground">{student?.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">{student?.phone}</TableCell>
              <TableCell className="text-center">
                {student?.courses?.map((course, idx) => (
                  <div key={idx} className="text-xs">
                    {course.title} - {course.batch}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-center">{student?.branches}</TableCell>
              <TableCell className="text-center">{student?.divisions}</TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant={student?.status === "PAID_COURSE_ENROLLED" ? "default" : "secondary"}>
                    {student?.status}
                  </Badge>
                  {student?.is_govt === 1 && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">Govt</Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {paginationData && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default StudentsData;
