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
import {
    EarningSite,
    getEarningSites,
} from "@/apiServices/earningSiteService";
import DeleteEarningSiteButton from "./DeleteEarningSiteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const EarningSitesData = async ({
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
        status:
            typeof resolvedSearchParams.status === "string"
                ? resolvedSearchParams.status
                : undefined,
        sort_order:
            typeof resolvedSearchParams.sort_order === "string"
                ? resolvedSearchParams.sort_order
                : undefined,
    };

    let results;
    try {
        results = await getEarningSites(params);
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

    const earningSites = results?.data?.earning_sites || [];
    const paginationData = results?.data?.pagination;

    const statusMap: Record<number, { label: string; className: string }> = {
        0: { label: "Inactive", className: "bg-red-50 text-red-700 border border-red-200 font-medium" },
        1: { label: "Active", className: "bg-green-50 text-green-700 border border-green-200 font-medium" },
    };

    if (!earningSites.length) {
        return (
            <NotFoundComponent message={results?.message || "No earning sites found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border bg-white overflow-hidden shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
                            <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
                            <TableHead className="font-semibold">Title</TableHead>
                            <TableHead className="text-center font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {earningSites?.map((site: EarningSite, index: number) => {
                            const siteStatus = statusMap[Number(site?.status)] ?? statusMap[1];

                            return (
                                <TableRow
                                    key={`${site?.id}`}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <TableCell className="text-center text-slate-500 font-medium">
                                        {(page - 1) * per_page + (index + 1)}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Badge className="cursor-pointer">Action</Badge>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="center">
                                                <PermissionGuard requiredPermission="edit-earning-sites">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/lms/earning-sites/${site?.id}/edit`}
                                                            className="flex items-center cursor-pointer"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Manage
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </PermissionGuard>
                                                <PermissionGuard requiredPermission="delete-earning-sites">
                                                    <DropdownMenuItem asChild>
                                                        <DeleteEarningSiteButton id={site?.id} />
                                                    </DropdownMenuItem>
                                                </PermissionGuard>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                    <TableCell className="font-semibold text-slate-800">
                                        {site?.title}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge className={siteStatus.className}>
                                            {siteStatus.label}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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

export default EarningSitesData;
