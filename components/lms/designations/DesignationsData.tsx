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
import { Designation, getDesignations } from "@/apiServices/designationService";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import ToggleDesignationStatusButton from "./ToggleDesignationStatusButton";
import DeleteDesignationButton from "./DeleteDesignationButton";

const DesignationsData = async ({
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
    };

    let results;
    try {
        results = await getDesignations(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const designations = results?.data?.designations || [];
    const paginationData = results?.data?.pagination;

    if (!designations.length) {
        return (
            <NotFoundComponent message={results?.message || "No designations found."} />
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
                            <TableHead className="text-center">Designation Name</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Toggle Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {designations.map((designation: Designation, index: number) => (
                            <TableRow key={designation?.id}>
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
                                            <PermissionGuard requiredPermission="edit-designations">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/lms/designations/${designation?.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Manage
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                            <PermissionGuard requiredPermission="delete-designations">
                                                <DropdownMenuItem asChild>
                                                    <DeleteDesignationButton id={designation?.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    {designation?.name}
                                </TableCell>
                                <TableCell className="text-center ">
                                    <Badge variant={designation.status_text.toLowerCase() === "active" ? "default" : "secondary"}>
                                        {designation.status_text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <PermissionGuard requiredPermission="edit-designations">
                                        <ToggleDesignationStatusButton
                                            id={designation.id}
                                            initialStatus={designation.status_text}
                                        />
                                    </PermissionGuard>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4 pb-6">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default DesignationsData;
