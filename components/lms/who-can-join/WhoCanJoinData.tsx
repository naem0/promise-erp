import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { getJoins, JoinType } from "@/apiServices/joinService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const WhoCanJoinData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_by:
      typeof resolvedSearchParams.sort_by === "string"
        ? resolvedSearchParams.sort_by
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
    results = await getJoins(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const joins = results?.data?.joins || [];
  const paginationData = results?.data?.pagination;

  if (!joins.length) {
    return <NotFoundComponent message={results?.message || "No joins found."} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {joins.map((join: JoinType, index: number) => (
            <TableRow key={join?.id}>
              <TableCell className="text-center">{(page - 1) * 15 + (index + 1)}</TableCell>
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
                    <PermissionGuard requiredPermission="sync-course-joins">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/who-can-join/${join?.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="delete-course-joins">
                      <DropdownMenuItem asChild>
                        <DeleteButton id={join?.id} />
                      </DropdownMenuItem>
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="font-medium text-center">{join?.title}</TableCell>
              <TableCell className="text-center">
                <Badge variant={join.status === 1 ? "outline" : "destructive"}>
                  {join.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {paginationData && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default WhoCanJoinData;
