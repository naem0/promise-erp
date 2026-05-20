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
import { CRMReferrer, getCRMReferrers } from "@/apiServices/crmReferrerService";
import DeleteReferrerButton from "./DeleteReferrerButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const getStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return (
                <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">
                    Active
                </Badge>
            );
        case 0:
        default:
            return (
                <Badge variant="destructive">
                    Inactive
                </Badge>
            );
    }
};

const ReferrersData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page =
        typeof resolvedSearchParams.page === "string"
            ? Number(resolvedSearchParams.page)
            : 1;
    const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;

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
        branch_name:
            typeof resolvedSearchParams.branch_name === "string"
                ? resolvedSearchParams.branch_name
                : undefined,
        date_from:
            typeof resolvedSearchParams.date_from === "string"
                ? resolvedSearchParams.date_from
                : undefined,
        date_to:
            typeof resolvedSearchParams.date_to === "string"
                ? resolvedSearchParams.date_to
                : undefined,
    };

    let results;
    try {
        results = await getCRMReferrers(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const referrers = results?.data?.referrers || [];
    const paginationData = results?.data?.pagination;

    if (!results?.success||!results?.data) {
        return null;
    }

    if (!referrers.length) {
        return (
            <NotFoundComponent message={results?.message || "No referrers found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-12">Sl</TableHead>
                            <TableHead className="text-center w-24">Action</TableHead>
                            <TableHead className="text-center w-16">Profile</TableHead>
                            <TableHead className="text-center min-w-[100px]">Branch</TableHead>
                            <TableHead className="text-left min-w-[150px]">Institute</TableHead>
                            <TableHead className="text-center min-w-[80px]">Visitors</TableHead>
                            <TableHead className="text-center min-w-[80px]">Interested</TableHead>
                            <TableHead className="text-center min-w-[80px]">Enrolls</TableHead>
                            <TableHead className="text-center min-w-[80px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {referrers.map((referrer: CRMReferrer, index: number) => (
                            <TableRow key={referrer?.id}>
                                <TableCell className="text-center font-medium">
                                    {(page - 1) * per_page + (index + 1)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Badge
                                                variant="default"
                                                role="button"
                                                tabIndex={0}
                                                className="cursor-pointer "
                                            >
                                                Action
                                            </Badge>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="center">
                                            <PermissionGuard requiredPermission="edit-crm-referrers">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/crm/lead-referrers/${referrer?.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>

                                            <PermissionGuard requiredPermission="delete-crm-referrers">
                                                <DropdownMenuItem asChild>
                                                    <DeleteReferrerButton id={referrer?.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={referrer.profile_photo || "/images/profile_avatar.png"}
                                            alt={referrer?.name}
                                            fill
                                            className="object-cover object-top rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p>{referrer?.name}</p>
                                        <p>{referrer?.email}</p>
                                        <p>{referrer?.phone}</p>
                                    </div>

                                </TableCell>
                                <TableCell className="text-center">
                                    {referrer?.branch_name || "—"}
                                </TableCell>
                                <TableCell className="text-left truncate max-w-xs">
                                    {referrer?.institute_name || "—"}
                                </TableCell>
                                <TableCell className="text-center font-semibold text-slate-700">
                                    {referrer.total_visitor}
                                </TableCell>
                                <TableCell className="text-center font-semibold text-amber-700">
                                    {referrer.total_interested}
                                </TableCell>
                                <TableCell className="text-center font-semibold text-green-700">
                                    {referrer.total_enroll}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(referrer.status)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default ReferrersData;
