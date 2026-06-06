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
import { GroupItem, getGroupItems } from "@/apiServices/inventoryGroupItemsService";
import DeleteGroupItemButton from "./DeleteGroupItemButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const GroupItemsData = async ({
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
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    category_id:
      typeof resolvedSearchParams.category_id === "string"
        ? resolvedSearchParams.category_id
        : undefined,
  };

  let results;
  try {
    results = await getGroupItems(params);
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

  const groupItems = results?.data?.group_items || [];
  const paginationData = results?.data?.pagination;

  if (!groupItems.length) {
    return (
      <NotFoundComponent message={results?.message || "No group items found."} />
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
              <TableHead className="font-semibold min-w-[150px]">Name</TableHead>
              <TableHead className="font-semibold">Barcode</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="text-center font-semibold">Items in Group</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupItems.map((item: GroupItem, index: number) => (
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
                      <PermissionGuard requiredPermission="edit-group-items">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/inventory-groups/${item?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-group-items">
                        <DropdownMenuItem asChild>
                          <DeleteGroupItemButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {item?.name}
                </TableCell>

                <TableCell className="text-slate-600 font-mono">
                  {item?.barcode || "—"}
                </TableCell>

                <TableCell>
                  {item?.category_name ? (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
                      {item.category_name}
                    </Badge>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <div className="font-semibold text-slate-700">
                    {item?.items_in_group ?? 0}
                  </div>
                </TableCell>

                <TableCell className="text-slate-600">
                  {item?.created_by || item?.user_name || "—"}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      Number(item?.status) === 1
                        ? "bg-green-50 text-green-700 border-green-100 font-medium"
                        : "bg-red-50 text-red-700 border-red-100 font-medium"
                    }
                  >
                    {Number(item?.status) === 1 ? "Active" : "Inactive"}
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

export default GroupItemsData;
