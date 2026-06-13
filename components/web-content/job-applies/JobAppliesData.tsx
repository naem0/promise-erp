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
import { Pencil, FileText } from "lucide-react";
import Link from "next/link";
import { JobApply, getJobApplies } from "@/apiServices/jobAppliesService";
import DeleteJobApplyButton from "./DeleteJobApplyButton";
import Pagination from "@/components/common/Pagination";
import { truncate } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const statusVariant = (
    status: number,
): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 0:
            return "secondary";
        case 1:
            return "outline";
        case 2:
            return "default";
        default:
            return "secondary";
    }
};

const JobAppliesData = async (
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) => {
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
        career_id:
            typeof resolvedSearchParams.career_id === "string"
                ? resolvedSearchParams.career_id
                : undefined,
    };

    let results;
    try {
        results = await getJobApplies(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    if (!results || !results?.data) {
        return  null;
    }

    const applies = results?.data?.applies || [];
    const paginationData = results?.data?.pagination;

    if (!applies?.length) {
        return (
            <NotFoundComponent message={results?.message || "No job applications found."} />
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
                            <TableHead className="text-start">Applicant Details
                            </TableHead>
                            <TableHead className="text-center">Job Position</TableHead>
                            <TableHead className="text-center">Resume</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Applied At</TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        { applies?.map((apply: JobApply, index: number) => (
                            <TableRow key={apply?.id}>
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
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/web-content/job-applies/${apply?.id}/edit`}
                                                    className="flex items-center cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Manage
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <DeleteJobApplyButton id={apply?.id} />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{apply?.name}</span>
                                        <span className="text-xs text-secondary" title={apply?.email || ""}>Email: {truncate(apply?.email, 30)}
                                        </span>
                                        <span className="text-xs text-secondary" title={apply?.phone || ""}>
                                            Phone: {truncate(apply?.phone, 30)}
                                        </span>
                                        <span className="text-xs text-secondary" title={apply?.address || ""}>
                                            Address: {truncate(apply?.address, 30)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm">{apply?.career?.title || "—"}</span>
                                </TableCell>


                                <TableCell className="text-center">
                                    {apply?.resume ? (
                                        <a
                                            href={apply.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            <FileText className="h-4 w-4" />
                                            View
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={statusVariant(apply?.status)}>
                                        {apply?.status_label || "—"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center text-sm text-muted-foreground">
                                    {apply?.created_at || "—"}
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

export default JobAppliesData;
