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
import {
  DydQuestionCategory,
  getDydQuestionCategories,
} from "@/apiServices/dydQuestionCategoryService";
import DeleteDydQuestionCategoryButton from "./DeleteDydQuestionCategoryButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const getTypeBadge = (type: number | string | undefined, typeName?: string) => {
  const typeNum = Number(type);
  switch (typeNum) {
    case 1:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          {typeName || "Mcq"}
        </span>
      );
    case 2:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          {typeName || "Short question"}
        </span>
      );
    case 3:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          {typeName || "Written"}
        </span>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-medium">
          {typeName || "Unknown"}
        </Badge>
      );
  }
};

const getStatusBadge = (status: number | string | undefined, statusName?: string) => {
  switch (Number(status)) {
    case 1:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          {statusName || "Active"}
        </span>
      );
    case 0:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          {statusName || "Inactive"}
        </span>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-medium">
          {statusName || "Unknown"}
        </Badge>
      );
  }
};

const DydQuestionCategoriesData = async ({
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
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getDydQuestionCategories(params);
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

  const items = results?.data?.categories || [];
  const paginationData = results?.data?.pagination;

  if (!items.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No DYD question categories found."}
      />
    );
  }

  return (
    <>
      {/* Desktop Table View (md and above) */}
      <div className="hidden md:block rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
              <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
              <TableHead className="font-semibold min-w-60">Question Category Name</TableHead>
              <TableHead className="text-center font-semibold w-40">Type</TableHead>
              <TableHead className="text-center font-semibold w-[140px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items?.map((item: DydQuestionCategory, index: number) => (
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
                      <Badge className="cursor-pointer select-none">
                        Action
                      </Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                      <PermissionGuard requiredPermission="edit-dyd-question-categories">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/dyd/question-categories/${item?.id}/edit`}
                            className="flex items-center cursor-pointer text-slate-700"
                          >
                            <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-dyd-question-categories">
                        <DropdownMenuItem asChild>
                          <DeleteDydQuestionCategoryButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-slate-800" title={item?.name}>
                    {item?.name}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  {getTypeBadge(item?.type, item?.type_name)}
                </TableCell>

                <TableCell className="text-center">
                  {getStatusBadge(item?.status, item?.status_name)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View (sm and below) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.map((item: DydQuestionCategory, index: number) => (
          <div
            key={`mobile-${item?.id}-${index}`}
            className="bg-card border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b pb-2">
              <span className="text-xs font-semibold text-slate-400">
                #{(page - 1) * per_page + (index + 1)}
              </span>
              <div className="flex items-center gap-2">
                {getTypeBadge(item?.type, item?.type_name)}
                {getStatusBadge(item?.status, item?.status_name)}
              </div>
            </div>

            <div className="font-semibold text-slate-900 text-base">
              {item?.name}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <PermissionGuard requiredPermission="edit-dyd-question-categories">
                <Link
                  href={`/lms/dyd/question-categories/${item?.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </PermissionGuard>
              <PermissionGuard requiredPermission="delete-dyd-question-categories">
                <div className="inline-block">
                  <DeleteDydQuestionCategoryButton id={item?.id} />
                </div>
              </PermissionGuard>
            </div>
          </div>
        ))}
      </div>

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-6 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default DydQuestionCategoriesData;
