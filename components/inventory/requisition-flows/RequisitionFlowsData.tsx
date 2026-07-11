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
import { RequisitionFlow, getRequisitionFlows } from "@/apiServices/inventoryRequisitionFlowsService";
import DeleteRequisitionFlowButton from "./DeleteRequisitionFlowButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";


const RequisitionFlowsData = async ({
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
  };

  let results;
  try {
    results = await getRequisitionFlows(params);
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

  const items = results?.data?.flows || [];
  const paginationData = results?.data?.pagination;

  if (!items.length) {
    return (
      <NotFoundComponent message={results?.message || "No requisition flows found."} />
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
              <TableHead className="font-semibold min-w-[280px]">Flow Name</TableHead>
              <TableHead className="text-center font-semibold w-[150px]">Flow Type</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item: RequisitionFlow, index: number) => (
              <TableRow key={`${item?.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
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
                      <PermissionGuard requiredPermission="edit-requisition-flows">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/requisition-flows/${item?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-requisition-flows">
                        <DropdownMenuItem asChild>
                          <DeleteRequisitionFlowButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-slate-900" title={item?.name}>
                    {item?.name}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  {item.is_head ? (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-medium">
                      HQ
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50 font-medium">
                      Branch
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      item.status_text.toLowerCase() === "active"
                        ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-medium"
                        : "bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-medium"
                    }
                  >
                    {item.status_text}
                  </Badge>
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

export default RequisitionFlowsData;
