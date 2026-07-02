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
import { ProductCategory, getProductCategories } from "@/apiServices/inventoryCategoriesService";
import DeleteCategoryButton from "./DeleteCategoryButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

const CategoriesData = async ({
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
    parent_id:
      typeof resolvedSearchParams.parent_id === "string"
        ? resolvedSearchParams.parent_id
        : undefined,
  };

  let results;
  try {
    results = await getProductCategories(params);
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

  const categories = results?.data?.categories || [];
  const paginationData = results?.data?.pagination;

  if (!categories.length) {
    return (
      <NotFoundComponent message={results?.message || "No categories found."} />
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
              <TableHead className="font-semibold min-w-[200px]">Description</TableHead>
              <TableHead className="font-semibold">Parent Category</TableHead>
              <TableHead className="text-center font-semibold">Products</TableHead>
              <TableHead className="text-center font-semibold">Sub-categories</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((category: ProductCategory, index: number) => (
              <TableRow key={`${category?.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
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
                        className="cursor-pointer "
                      >
                        Action
                      </Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                      <PermissionGuard requiredPermission="edit-product-categories">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/inventory-categories/${category?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-product-categories">
                        <DropdownMenuItem asChild>
                          <DeleteCategoryButton id={category?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {category?.name}
                </TableCell>

                <TableCell className="text-slate-600" title={category?.description || ""}>
                  {category?.description ? truncate(category.description, 40) : "—"}
                </TableCell>

                <TableCell>
                  {category?.ancestors && category.ancestors.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      {category.ancestors.map((ancestor, idx) => (
                        <span key={ancestor.id} className="flex items-center gap-1">
                          {idx > 0 && <span className="text-slate-300">→</span>}
                          <Badge variant="secondary" className="bg-blue-50/60 text-blue-700 border-blue-100/40 font-normal py-0 px-1.5 text-[11px] h-5">
                            {ancestor.name}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  ) : category?.parent_name ? (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
                      {category.parent_name}
                    </Badge>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center font-semibold text-slate-700">
                  {category?.products_count ?? 0}
                </TableCell>

                <TableCell className="text-center font-semibold text-slate-700">
                  {category?.children_count ?? 0}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      Number(category?.status) === 1
                        ? "bg-green-50 text-green-700 border-green-100 font-medium"
                        : "bg-red-50 text-red-700 border-red-100 font-medium"
                    }
                  >
                    {Number(category?.status) === 1 ? "Active" : "Inactive"}
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

export default CategoriesData;
