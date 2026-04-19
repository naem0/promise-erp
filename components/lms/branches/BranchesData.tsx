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
import { Branch, getBranches } from "@/apiServices/branchService";
import DeleteBranchButton from "./DeleteBranchButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const BranchesData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
    const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;
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
        district_id:
            typeof resolvedSearchParams.district_id === "string"
                ? resolvedSearchParams.district_id
                : undefined,
    };

    let results;
    try {
        results = await getBranches(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const branches = results?.data?.branches || [];
    const paginationData = results?.data?.pagination;
    if (!branches.length) {
        return (
            <NotFoundComponent message={results?.message || "No branches found."} />
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
                            <TableHead className="text-center">Branch Name</TableHead>
                            <TableHead className="text-center">Code</TableHead>
                            <TableHead className="text-center">District</TableHead>
                            <TableHead className="text-center">Division</TableHead>
                            <TableHead className="text-center">Students</TableHead>
                            <TableHead className="text-center">Teachers</TableHead>
                            <TableHead className="text-center">Employees</TableHead>
                            <TableHead className="text-center">Phone</TableHead>
                            <TableHead className="text-center">Email</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {branches.map((branch: Branch, index: number) => (
                            <TableRow key={branch?.id}>
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
                                            <PermissionGuard requiredPermission="edit-branches">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/lms/branches/${branch?.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Manage
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                            <PermissionGuard requiredPermission="delete-branches">
                                                <DropdownMenuItem asChild>
                                                    <DeleteBranchButton id={branch?.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {branch?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.code || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.district?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.division?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.student_count ?? 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.teacher_count ?? 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    {branch?.employee_count ?? 0}
                                </TableCell>
                                <TableCell className="text-center whitespace-pre-line">
                                    {Array.isArray(branch?.phone)
                                        ? branch.phone.map((p, idx) => <div key={idx}>{p}</div>)
                                        : branch?.phone || "—"}
                                </TableCell>
                                <TableCell className="text-center whitespace-pre-line">
                                    {Array.isArray(branch?.email)
                                        ? branch.email.map((e, idx) => <div key={idx}>{e}</div>)
                                        : branch?.email || "—"}
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

export default BranchesData;
