"use client";

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
import { CRMSource } from "@/apiServices/crmSourceService";
import DeleteCRMSourceButton from "./DeleteCRMSourceButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface CRMSourcesTableProps {
    sources: CRMSource[];
    page: number;
    perPage: number;
    totalSources: number;
}

export default function CRMSourcesTable({
    sources,
    page,
    perPage,
    totalSources,
}: CRMSourcesTableProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Lead Sources
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({totalSources} total)
                    </span>
                </h2>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Leads Count</TableHead>
                            <TableHead className="text-center">Current Week</TableHead>
                            <TableHead className="text-center">Last Week</TableHead>
                            <TableHead className="text-center">Performance</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sources.map((source: CRMSource, index: number) => (
                            <TableRow key={source.id}>
                                <TableCell className="text-center">
                                    {(page - 1) * perPage + (index + 1)}
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
                                            <PermissionGuard requiredPermission="edit-crm-sources">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/crm/sources/${source.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                            <PermissionGuard requiredPermission="delete-crm-sources">
                                                <DropdownMenuItem asChild>
                                                    <DeleteCRMSourceButton id={source.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                <TableCell className="font-medium text-center">
                                    {source.name}
                                </TableCell>

                                <TableCell className="text-center">
                                    <Badge variant="secondary">{source.leads_count}</Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                    {source.current_week_leads_count}
                                </TableCell>

                                <TableCell className="text-center">
                                    {source.last_week_leads_count}
                                </TableCell>

                                <TableCell className="text-center">
                                    <span className={source.last_week_percentage.includes("↑") ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                        {source.last_week_percentage}
                                    </span>
                                </TableCell>

                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={
                                            source.status === 1
                                                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                                : "border-rose-500 text-rose-600 bg-rose-50"
                                        }
                                    >
                                        {source.status === 1 ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
