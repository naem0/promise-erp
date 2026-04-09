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
                            <TableHead className="text-center">Image</TableHead>
                            <TableHead className="text-center">Name & Email</TableHead>
                            <TableHead className="text-center">Phone</TableHead>
                            <TableHead className="text-center">Employee ID</TableHead>
                            <TableHead className="text-center">Designation</TableHead>
                            <TableHead className="text-center">Department</TableHead>
                            <TableHead className="text-center">Branch</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Blood Group</TableHead>
                            <TableHead className="text-center">Type</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {employees.map((employee: Employee, index: number) => (
                            <TableRow key={employee?.id}>
                                <TableCell className="text-center">
                                    {(page - 1) * 15 + (index + 1)}
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
                                <TableCell className="font-medium flex items-center justify-center">
                                    <Image
                                        src={employee.profile_image || "/images/profile_avatar.png"}
                                        alt={employee?.name}
                                        width={40}
                                        height={40}
                                        className="object-cover rounded-full h-10 w-10"
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    <div className="flex flex-col">
                                        <span>{employee?.name}</span>
                                        <span className="text-xs text-secondary">{employee?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.phone || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.employee_id || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.designation?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.department?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.branches?.map((b) => b.name).join(", ") || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.role?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {employee?.blood_group || "—"}
                                </TableCell>
                                <TableCell className="text-center">

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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {paginationData && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default EmployeesData;
