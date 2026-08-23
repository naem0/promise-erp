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
import { Pencil, Eye, Layers } from "lucide-react";
import Link from "next/link";
import {
  getProductAssignments,
  ProductAssignment,
} from "@/apiServices/inventoryItemUsersService";
import DeleteAssignedButton from "./DeleteAssignedButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

const getStatusBadge = (status: number | string | undefined, statusName?: string) => {
  switch (Number(status)) {
    case 1:
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium text-xs">
          {statusName || "Active"}
        </Badge>
      );
    case 0:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 font-medium text-xs">
          {statusName || "Inactive"}
        </Badge>
      );
    case 2:
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium text-xs">
          {statusName || "Repair"}
        </Badge>
      );
    case 3:
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium text-xs">
          {statusName || "Damaged"}
        </Badge>
      );
    case 4:
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 font-medium text-xs">
          {statusName || "Transferred"}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-slate-600 text-xs font-normal">
          {statusName || "—"}
        </Badge>
      );
  }
};

const ItemUsersData = async ({
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
    user_id:
      typeof resolvedSearchParams.user_id === "string"
        ? resolvedSearchParams.user_id
        : undefined,
    product_id:
      typeof resolvedSearchParams.product_id === "string"
        ? resolvedSearchParams.product_id
        : undefined,
    group_item_id:
      typeof resolvedSearchParams.group_item_id === "string"
        ? resolvedSearchParams.group_item_id
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    room_id:
      typeof resolvedSearchParams.room_id === "string"
        ? resolvedSearchParams.room_id
        : undefined,
  };

  let results;
  try {
    results = await getProductAssignments(params);
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

  const assignments = results?.data?.assignments || [];
  const paginationData = results?.data?.pagination;

  if (!assignments.length) {
    return (
      <NotFoundComponent message={results?.message || "No Item assigned found."} />
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
              <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
              <TableHead className="font-semibold min-w-[200px]">Item</TableHead>
              <TableHead className="font-semibold min-w-[180px]">Employee </TableHead>
              <TableHead className="font-semibold min-w-[150px]">Branch &Room</TableHead>
              <TableHead className="font-semibold text-center w-[90px]">Qty</TableHead>
              <TableHead className="font-semibold min-w-[160px]">Assigned Info</TableHead>
              <TableHead className="text-center font-semibold w-[110px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments.map((assignment: ProductAssignment, index: number) => (
              <TableRow
                key={`${assignment?.id}-${index}`}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="text-center text-slate-500 font-medium">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="default"
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                      >
                        Action
                      </Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                      <PermissionGuard requiredPermission="view-product-users">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/item-users/user/${assignment?.user_id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="edit-product-users">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/item-users/${assignment?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Assignment
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-product-users">
                        <DeleteAssignedButton id={assignment?.id} />
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                {/* Product / Item */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-slate-900 leading-tight">
                      {truncate(assignment?.product_name || "", 30)}
                    </span>
                    {assignment?.group_item_name && (
                      <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200/80 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit font-medium">
                        <Layers className="w-3 h-3 text-purple-600" />
                        Group: {truncate(assignment.group_item_name, 22)}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Employee Info */}
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-xs">
                    <Link
                      href={`/inventory/item-users/user/${assignment?.user_id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors truncate"
                      title={assignment?.employee_name}
                    >
                      {truncate(assignment?.employee_name || "", 26)}
                    </Link>
                    {assignment?.employee_email && (
                      <span className="text-slate-500 truncate text-[11px]" title={assignment.employee_email}>
                        {assignment.employee_email}
                      </span>
                    )}
                    {assignment?.employee_phone && (
                      <span className="text-slate-500 text-[11px]">
                        {assignment.employee_phone}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Branch / Room */}
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-slate-800">
                      {assignment?.branch_name || "—"}
                    </span>
                    {assignment?.room_name && (
                      <span className="text-slate-500 text-[11px]">
                        Room: {assignment.room_name}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Quantity */}
                <TableCell className="text-center">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-bold px-2.5">
                    {assignment?.quantity ?? 1}
                  </Badge>
                </TableCell>

                {/* Assigned Info */}
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="text-slate-700 font-medium">
                      Date: {assignment?.assigned_date || "—"}
                    </span>
                    {assignment?.assigned_by_name && (
                      <span className="text-slate-400 text-[11px]">
                        By: {assignment.assigned_by_name}
                      </span>
                    )}
                    {assignment?.returned_date && (
                      <span className="text-amber-700 text-[11px]">
                        Ret: {assignment.returned_date}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  {getStatusBadge(assignment?.status, assignment?.status_name)}
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

export default ItemUsersData;

