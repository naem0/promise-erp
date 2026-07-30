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
import { CrmStatus, getCrmStatuses } from "@/apiServices/crmStatusesService";
import DeleteLeadStatusButton from "./DeleteLeadStatusButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const getTypeBadge = (type: number | string | undefined) => {
  switch (Number(type)) {
    case 1:
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-100 font-normal"
        >
          Lead
        </Badge>
      );
    case 2:
      return (
        <Badge
          variant="secondary"
          className="bg-purple-50 text-purple-700 border-purple-100 font-normal"
        >
          Activity
        </Badge>
      );
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-50 text-slate-700 border-slate-100 font-normal"
        >
          Type {type}
        </Badge>
      );
  }
};

const LeadStatusesData = async ({
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
    type:
      typeof resolvedSearchParams.type === "string"
        ? resolvedSearchParams.type
        : undefined,
  };

  let results;
  try {
    results = await getCrmStatuses(params);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results?.data) {
    return null;
  }

  const items = results?.data?.statuses || [];
  const paginationData = results?.data?.pagination;

  if (!items?.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No lead statuses found."}
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
              <TableHead className="font-semibold min-w-[200px]">
                Status
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[120px]">
                Type
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[120px]">
                Leads Count
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items?.map((item: CrmStatus, index: number) => (
              <TableRow
                key={`${item?.id}-${index}`}
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
                      <PermissionGuard requiredPermission="edit-crm-statuses">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/crm/lead-statuses/${item?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-crm-statuses">
                        <DropdownMenuItem asChild>
                          <DeleteLeadStatusButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-slate-800">
                    {item?.status}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  {getTypeBadge(item?.type)}
                </TableCell>

                <TableCell className="text-center">
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 font-medium shadow-none">
                    {item?.leads_count}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {paginationData && paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default LeadStatusesData;
