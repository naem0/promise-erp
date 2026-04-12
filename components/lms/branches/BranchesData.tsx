import { getBranches } from "@/apiServices/branchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/apiServices/branchService";
import { PaginationType } from "@/types/pagination";

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
import DeleteBranchButton from "@/components/lms/branches/DeleteBranchButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";


/* ---------------------- Component ---------------------- */

export default async function BranchesData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1;
  const per_page = typeof resolvedParams.per_page === "string" ? Number(resolvedParams.per_page) : 15;
  const params = {
    page,
    per_page,
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    sort_by: typeof resolvedParams.sort_by === "string" ? resolvedParams.sort_by : undefined,
    sort_order: typeof resolvedParams.sort_order === "string" ? resolvedParams.sort_order : undefined,
  };

  let data;
  try {
    data = await getBranches(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const branches: Branch[] = data?.data?.branches ?? [];
  const pagination: PaginationType = data?.data?.pagination ?? {};

  if (branches.length === 0) {
    return <NotFoundComponent message={data?.message} title="Branch List" />;
  }
  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SI</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead>Branch Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {branches.map((branch: Branch, i: number) => (
              <TableRow key={branch.id}>
                <TableCell>{i + 1}</TableCell>

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
                      <PermissionGuard requiredPermission="edit-branches">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/branches/${branch.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-branches">
                        <DropdownMenuItem asChild>
                          <DeleteBranchButton id={branch.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>{branch.name || "N/A"}</TableCell>
                <TableCell>{branch.district?.name || "N/A"}</TableCell>
                <TableCell>{branch.student_count ?? 0}</TableCell>
                <TableCell>{branch.teacher_count ?? 0}</TableCell>
                <TableCell>{branch.employee_count ?? 0}</TableCell>
                <TableCell>{branch.address || "N/A"}</TableCell>
                <TableCell className="whitespace-pre-line">
                  {Array.isArray(branch.phone)
                    ? branch.phone.map((p, idx) => <div key={idx}>{p}</div>)
                    : branch.phone || "N/A"}
                </TableCell>
                <TableCell className="whitespace-pre-line">
                  {Array.isArray(branch.email)
                    ? branch.email.map((e, idx) => <div key={idx}>{e}</div>)
                    : branch.email || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination?.has_more_pages && (
        <div className="my-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
}
