import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getStudents, Student } from "@/apiServices/studentService";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeleteButton from "./DeleteButton";
import ToggleStudentStatusButton from "./ToggleStudentStatusButton";
import Pagination from "@/components/common/Pagination";

const getStatusBadge = (isBlocked?: number) => {
  if (Number(isBlocked) === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        Blocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
      Active
    </span>
  );
};

const getEnrollmentStatusBadge = (status?: string | null) => {
  switch (status) {
    case "PAID_COURSE_ENROLLED":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-medium">
          Paid Enrolled
        </Badge>
      );
    case "FREE_COURSE_ENROLLED":
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-medium">
          Free Enrolled
        </Badge>
      );
    case "GOVT_COURSE_ENROLLED":
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-50 font-medium">
          Govt Enrolled
        </Badge>
      );
    case "NOT_ENROLLED":
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 font-medium">
          Not Enrolled
        </Badge>
      );
    default:
      return status ? (
        <Badge variant="outline">{status}</Badge>
      ) : (
        <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50 font-medium">
          —
        </Badge>
      );
  }
};

const StudentsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    is_govt:
      typeof resolvedSearchParams.is_govt === "string"
        ? resolvedSearchParams.is_govt
        : undefined,
    is_paid:
      typeof resolvedSearchParams.is_paid === "string"
        ? resolvedSearchParams.is_paid
        : undefined,
    is_blocked:
      typeof resolvedSearchParams.is_blocked === "string"
        ? resolvedSearchParams.is_blocked
        : undefined,
    division_id:
      typeof resolvedSearchParams.division_id === "string"
        ? resolvedSearchParams.division_id
        : undefined,
    district_id:
      typeof resolvedSearchParams.district_id === "string"
        ? resolvedSearchParams.district_id
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

  if (!results || !results?.data) {
    return null;
  }

  const students = results?.data?.students || [];
  const paginationData = results?.data?.pagination;

  if (!students?.length) {
    return (
      <NotFoundComponent message={results?.message || "No students found."} />
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-left">Profile</TableHead>
              <TableHead className="text-left">Courses & Batches</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Division</TableHead>
              <TableHead className="text-center">District</TableHead>
              <TableHead className="text-center">Enrollment</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students?.map((student: Student, index: number) => (
              <TableRow key={`${student?.id}-${index}`}>
                <TableCell className="text-center">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>

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

                <TableCell className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 shrink-0">
                    <Image
                      src={(student?.profile_image && typeof student?.profile_image === "string" && student?.profile_image.trim() !== "") ? student?.profile_image : "/images/profile_avatar.png"}
                      alt={student?.name || "Student"}
                      fill
                      className="object-cover object-top rounded-full border border-slate-200"
                    />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      {student?.name || "—"}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-medium text-slate-700">Email:</span>{" "}
                      {student?.email || "—"}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-medium text-slate-700">Phone:</span>{" "}
                      {student?.phone || "—"}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-xs space-y-1">
                  {student?.courses && student?.courses?.length > 0 ? (
                    student?.courses?.map((course, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {course?.title}
                        </span>
                        {course?.batch && (
                          <span className="text-slate-500 text-[11px]">
                            Batch: {course?.batch}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center text-xs text-slate-700">
                  {student?.branches || "—"}
                </TableCell>

                <TableCell className="text-center text-xs text-slate-700">
                  {student?.divisions || "—"}
                </TableCell>

                <TableCell className="text-center text-xs text-slate-700">
                  {student?.districts || "—"}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    {getEnrollmentStatusBadge(student?.status)}
                    {student?.is_govt === 1 && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium text-[10px] px-1.5 py-0.5">
                        Govt
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <PermissionGuard
                    requiredPermission="update-student-status"
                    fallback={getStatusBadge(student?.is_blocked)}
                  >
                    <ToggleStudentStatusButton
                      id={student?.id}
                      isBlocked={student?.is_blocked ?? 0}
                    />
                  </PermissionGuard>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginationData && paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default StudentsData;

