import { deleteStats, getStats, Stats } from "@/apiServices/statsService"; // This will be created later
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import { StatsSearchParamsProps } from "@/app/(admin-dashboard)/web-content/stats/page";
import DeleteButton from "@/components/common/DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default async function StatsData({
  searchParams }: StatsSearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;

  const params = {
    page,
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    sort_order: typeof resolvedSearchParams.sort_order === "string" ? resolvedSearchParams.sort_order : undefined,
    type: typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : undefined,
    status: typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
  };

  let data;
  try {
    data = await getStats(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message={data?.message ?? "An unexpected error occurred."} />;
    }
  }

  const stats = data?.data?.stats ?? [];
  const pagination = data?.data?.pagination ?? {};

  if (stats.length === 0) {
    return <NotFoundComponent message={data?.message ?? "No stats found."} />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stats.map((statData: Stats, index: number) => (
              <TableRow key={statData?.id}>
                <TableCell>{(pagination.current_page - 1) * pagination.per_page + index + 1}</TableCell>
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
                      <PermissionGuard requiredPermission="view-stats">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/stats/${statData?.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="edit-stats">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/stats/${statData?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-stats">
                        <DropdownMenuItem asChild>
                          <DeleteButton
                            id={statData?.id}
                            deleteAction={deleteStats}
                            itemName="stat"
                          />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {statData?.title}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{statData?.count ?? "-"}</TableCell>
                <TableCell>
                  <Image
                    src={statData?.image || "/images/placeholder.png"}
                    alt={statData?.title}
                    width={40}
                    height={40}
                    className="object-cover rounded-md border"
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statData?.status === 1 ? "bg-primary" : "bg-red-600"
                    }
                  >
                    {statData?.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination pagination={pagination} />
    </>
  );
}
