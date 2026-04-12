
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
import { Tool, getTools } from "@/apiServices/toolsService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const ToolsData = async ({
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
        status:
            typeof resolvedSearchParams.status === "string"
                ? resolvedSearchParams.status
                : undefined,
    };

    let results;
    try {
        results = await getTools(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const tools = results?.data?.tools || [];
    const paginationData = results?.data?.pagination;
    if (!tools.length) {
        return (
            <NotFoundComponent message={results?.message || "No tools found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border mb-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                            <TableHead className="text-center">Image</TableHead>
                            <TableHead className="text-center">Title</TableHead>
                            <TableHead className="text-center">Sub Title</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tools.map((tool: Tool, index: number) => (
                            <TableRow key={tool?.id}>
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
                                            <PermissionGuard requiredPermission="edit-course-tools">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/lms/tools/${tool?.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Manage
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>

                                            <PermissionGuard requiredPermission="delete-course-tools">
                                                <DropdownMenuItem asChild>
                                                    <DeleteButton id={tool?.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium flex items-center justify-center">
                                    <Image
                                        src={tool.image || "/images/placeholder.png"}
                                        alt={tool?.title}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    {tool?.title}
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    {tool?.sub_title}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={tool.status === 1 ? "outline" : "destructive"}>
                                        {tool.status === 1 ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {paginationData?.has_more_pages && (
                <div className="my-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default ToolsData;
