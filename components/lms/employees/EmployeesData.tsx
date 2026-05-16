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
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

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
  if (!employees.length) {
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
              <TableHead className="text-center">Profile</TableHead>
              <TableHead className="text-center">Employee ID</TableHead>
              <TableHead className="text-center">Designation</TableHead>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Display Order</TableHead>
              <TableHead className="text-center">Blood Group</TableHead>
              <TableHead className="text-center">Type</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((employee: Employee, index: number) => (
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
                <TableCell className="flex items-center gap-2">
                  <div className="relative w-12 h-12">
                    <Image
                      src={
                        employee.profile_image || "/images/profile_avatar.png"
                      }
                      alt={employee?.name}
                      fill
                      className="object-cover object-top rounded-full"
                    />
                  </div>
                  <div>
                    <p className="">{employee?.name}</p>
                    <p className="text-xs text-secondary">{employee?.email}</p>
                    <p className="text-xs text-secondary">{employee?.phone}</p>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {employee?.employee_id || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.designation?.name || "—"}
                </TableCell>
                {/* use truncate */}
                <TableCell
                  className="text-center"
                  title={employee?.department?.name || "—"}
                >
                  {truncate(employee?.department?.name, 20) ||
                    employee?.department?.name ||
                    "—"}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.branches && employee?.branches?.length > 0 ? (
                    <>
                      {employee.branches.slice(0, 2).map((b, index) => (
                        <span key={b.id || index}>
                          {b.name}
                          {index < Math.min(2, employee.branches.length) - 1 &&
                            ", "}
                        </span>
                      ))}

                      {employee.branches.length > 2 && (
                        <span className="text-gray-500 ml-1">
                          +{employee.branches.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.role?.name || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.display_order ?? "—"}
                </TableCell>
                <TableCell className="text-center">
                  {employee?.blood_group || "—"}
                </TableCell>
                {/* <TableCell className="text-center">
                                    <Badge
                                        variant={
                                            +employee.employment_type === 0
                                                ? "default"
                                                : +employee.employment_type === 1
                                                    ? "secondary"
                                                    : +employee.employment_type === 2
                                                        ? "outline"
                                                        : +employee.employment_type === 3
                                                            ? "destructive"
                                                            : "default"
                                        }
                                    >
                                        {+employee.employment_type === 0
                                            ? "Probation"
                                            : +employee.employment_type === 1
                                                ? "Full-time"
                                                : +employee.employment_type === 2
                                                    ? "Part-time"
                                                    : +employee.employment_type === 3
                                                        ? "Contractual"
                                                        : "—"}
                                    </Badge>
                                </TableCell> */}

                <TableCell className="text-center">
                  {(() => {
                    let label = "—";
                    let variant:
                      | "default"
                      | "secondary"
                      | "outline"
                      | "destructive" = "default";

                    if (
                      employee?.employment_type !== null &&
                      employee?.employment_type !== undefined
                    ) {
                      switch (Number(employee.employment_type)) {
                        case 0:
                          label = "Probation";
                          variant = "default";
                          break;

                        case 1:
                          label = "Full-time";
                          variant = "secondary";
                          break;

                        case 2:
                          label = "Part-time";
                          variant = "outline";
                          break;

                        case 3:
                          label = "Contractual";
                          variant = "destructive";
                          break;
                      }
                    }

                    return <Badge variant={variant}>{label}</Badge>;
                  })()}
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
