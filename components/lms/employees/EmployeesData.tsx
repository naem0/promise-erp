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
import { Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Employee, getEmployees } from "@/apiServices/employeeService";
import DeleteEmployeeButton from "./DeleteEmployeeButton";
import ToggleEmployeeStatusButton from "./ToggleEmployeeStatusButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

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

const getEmploymentTypeBadge = (type: number | string | undefined) => {
  switch (Number(type)) {
    case 0:
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-medium">
          Probation
        </Badge>
      );
    case 1:
      return (
        <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-medium">
          Full-time
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-50 font-medium">
          Part-time
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 font-medium">
          Contractual
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50 font-medium">
          —
        </Badge>
      );
  }
};

const EmployeesData = async ({
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
    employment_type:
      typeof resolvedSearchParams.employment_type === "string"
        ? resolvedSearchParams.employment_type
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    department_id:
      typeof resolvedSearchParams.department_id === "string"
        ? resolvedSearchParams.department_id
        : undefined,
    role_id:
      typeof resolvedSearchParams.role_id === "string"
        ? resolvedSearchParams.role_id
        : undefined,
    designation_id:
      typeof resolvedSearchParams.designation_id === "string"
        ? resolvedSearchParams.designation_id
        : undefined,
    blood_group:
      typeof resolvedSearchParams.blood_group === "string"
        ? resolvedSearchParams.blood_group
        : undefined,
  };

  let results;
  try {
    results = await getEmployees(params);
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

  const employees = results?.data?.employees || [];
  const paginationData = results?.data?.pagination;
  if (!employees?.length) {
    return (
      <NotFoundComponent message={results?.message || "No employees found."} />
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
              <TableHead className="text-center">Employee ID</TableHead>
              <TableHead className="text-left">Position Details</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Display Order</TableHead>
              <TableHead className="text-center">Blood Group</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees?.map((employee: Employee, index: number) => (
              <TableRow key={`${employee?.id}-${index}`}>
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
                      <PermissionGuard requiredPermission="edit-employees">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/employees/${employee?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-employees">
                        <DropdownMenuItem asChild>
                          <DeleteEmployeeButton id={employee?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 shrink-0">
                    <Image
                      src={
                        employee?.profile_image || "/images/profile_avatar.png"
                      }
                      alt={employee?.name || "Employee"}
                      fill
                      className="object-cover object-top rounded-full border border-slate-200"
                    />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-slate-800">{employee?.name || "—"}</p>
                    <p className="text-slate-500">
                      <span className="font-medium text-slate-700">Email:</span>{" "}
                      {employee?.email || "—"}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-medium text-slate-700">Phone:</span>{" "}
                      {employee?.phone || "—"}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {employee?.employee_id || "—"}
                </TableCell>
                <TableCell className="text-xs space-y-0.5">
                  <p className="font-semibold text-slate-800">{employee?.designation?.name || "—"}</p>
                  <p className="text-slate-500">
                    <span className="font-medium text-slate-700">Dept:</span>{" "}
                    {employee?.department?.name || "—"}
                  </p>
                  <p className="text-slate-500">
                    <span className="font-medium text-slate-700">Role:</span>{" "}
                    {employee?.role?.name || "—"}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  {employee?.branches && employee?.branches?.length > 0 ? (
                    <>
                      {employee?.branches?.slice(0, 2)?.map((b, index) => (
                        <span key={b?.id || index}>
                          {b?.name}
                          {index < Math.min(2, employee?.branches?.length) - 1 &&
                            ", "}
                        </span>
                      ))}

                      {employee?.branches?.length > 2 && (
                        <span className="text-gray-500 ml-1">
                          +{employee?.branches?.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.display_order ?? "—"}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.blood_group || "—"}
                </TableCell>


                <TableCell className="text-center">
                  {getEmploymentTypeBadge(employee?.employment_type)}
                </TableCell>

                <TableCell className="text-center">
                  <PermissionGuard
                    requiredPermission="update-employee-status"
                    fallback={getStatusBadge(employee?.is_blocked)}
                  >
                    <ToggleEmployeeStatusButton
                      id={employee?.id}
                      isBlocked={employee?.is_blocked ?? 0}
                    />
                  </PermissionGuard>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default EmployeesData;
