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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import {
  Requisition,
  getRequisitions,
} from "@/apiServices/requisitionsService";
import DeleteRequisitionButton from "./DeleteRequisitionButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

// =======================
// Status badge styles
// =======================

function getStatusBadgeClass(status: number): string {
  switch (status) {
    case 0:
      return "bg-yellow-30 text-yellow-400 border-yellow-100";
    case 1:
      return "bg-blue-30 text-blue-400 border-blue-100";
    case 2:
      return "bg-red-30 text-red-400 border-red-100";
    case 3:
      return "bg-green-30 text-green-400 border-green-100";
    default:
      return "bg-slate-30 text-slate-400 border-slate-100";
  }
}

// type: 1 = Item-based, type: 2 = Amount-based

function getTypeBadgeClass(type: number): string {
  return type === 1
    ? "bg-purple-20 text-purple-400 border-purple-100"
    : "bg-cyan-30 text-cyan-600 border-cyan-200";
}

// =======================
// Main Component
// =======================

const RequisitionsData = async ({
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
    type:
      typeof resolvedSearchParams.type === "string"
        ? resolvedSearchParams.type
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
  };

  let results;
  try {
    results = await getRequisitions(params);
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

  const requisitions = results?.data?.requisitions || [];
  const paginationData = results?.data?.pagination;

  if (!requisitions.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No requisitions found."}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center font-semibold w-[60px]">
                Sl
              </TableHead>
              <TableHead className="text-center font-semibold w-[100px]">
                Action
              </TableHead>
              <TableHead className="font-semibold min-w-[150px]">
                Challan No
              </TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Requested By</TableHead>
              <TableHead className="font-semibold">Branch</TableHead>
              <TableHead className="text-center font-semibold">Items</TableHead>
              <TableHead className="text-right font-semibold">
                Total Amount
              </TableHead>
              <TableHead className="text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="text-center font-semibold">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requisitions?.map((requisition: Requisition, index: number) => {
              return (
                <TableRow
                  key={`${requisition?.id}-${index}`}
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
                        <PermissionGuard requiredPermission="view-requisitions">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/inventory/requisitions/${requisition?.id}`}
                              className="flex items-center cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="edit-requisitions">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/inventory/requisitions/${requisition?.id}/edit`}
                              className="flex items-center cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="delete-requisitions">
                          <DropdownMenuItem asChild>
                            <DeleteRequisitionButton id={requisition?.id} />
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell className="font-medium text-slate-900">
                    {requisition?.challan_no}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`${getTypeBadgeClass(requisition?.type)} font-normal`}
                    >
                      {requisition?.type_text}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-700">
                    {requisition?.user?.name}
                  </TableCell>

                  <TableCell className="text-slate-600">
                    <Badge
                      variant="secondary"
                      className="bg-blue-20 text-blue-400 border-blue-100 font-normal"
                    >
                      {requisition?.branch_to?.name || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-semibold text-slate-700">
                    {requisition?.item_count ?? 0}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-slate-700">
                    ৳ {requisition?.total_amount ?? 0}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      className={`${getStatusBadgeClass(requisition?.status)} font-medium`}
                    >
                      {requisition?.status_text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-700">
                    {requisition?.description ?? "—"}
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

export default RequisitionsData;
