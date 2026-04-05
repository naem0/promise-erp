import { getTeachers } from "@/apiServices/teacherService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
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
import { Pencil } from "lucide-react";
import Link from "next/link";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeleteButton from "./DeleteButton";

export default async function TeachersData({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    is_paid:
      typeof resolvedSearchParams.is_paid === "string" ? resolvedSearchParams.is_paid : undefined,
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
    per_page: 15
  };

  let data;
  try {
    data = await getTeachers(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const teachers = data.data.teachers;
  const pagination = data.data.pagination;

  if (teachers.length === 0) {
    return <NotFoundComponent message={data?.message} title="Teacher List" />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Organization</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.map((teacher, i) => (
              <TableRow key={teacher.id}>
                <TableCell>{(page - 1) * 15 + (i + 1)}</TableCell>

                {/*  Action Dropdown */}
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
                      <PermissionGuard requiredPermission="edit-teachers">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/teachers/${teacher.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-teachers">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={teacher?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.bn_name}
                    </p>
                  </div>
                </TableCell>

                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>
                  {teacher.subscription_details?.name || "Free Plan"}
                </TableCell>
                <TableCell>
                  {teacher.is_paid ? (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Paid
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-200 text-gray-700"
                    >
                      Free
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{teacher.organization?.name || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {
        pagination && (
          <div className="mt-4">
            <Pagination pagination={pagination} />
          </div>
        )
      }
    </>
  );
}
