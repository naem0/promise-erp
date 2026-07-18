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
import { ProductItem, getProductItems } from "@/apiServices/inventoryItemsService";
import DeleteItemButton from "./DeleteItemButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";
import Image from "next/image";

const getCategoryBadge = (categoryName: string | undefined) => {
  if (!categoryName) return <span className="text-slate-400">—</span>;
  
  switch (categoryName.toLowerCase()) {
    // Add specific cases here if needed, e.g.
    // case 'electronics': return <Badge className="bg-blue-50 text-blue-700">...</Badge>
    default:
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
          {categoryName}
        </Badge>
      );
  }
};

const getBrandBadge = (brandName: string | undefined) => {
  if (!brandName) return <span className="text-slate-400">—</span>;
  
  switch (brandName.toLowerCase()) {
    // Add specific cases here if needed, e.g.
    // case 'apple': return <Badge className="bg-gray-50 text-gray-700">...</Badge>
    default:
      return (
        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 font-normal">
          {brandName}
        </Badge>
      );
  }
};

const getStatusBadge = (status: number | string | undefined) => {
  switch (Number(status)) {
    case 1:
      return (
        <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-medium">
          Active
        </Badge>
      );
    case 0:
      return (
        <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-medium">
          Inactive
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50 font-medium">
          Unknown
        </Badge>
      );
  }
};

const ItemsData = async ({
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
    brand_id:
      typeof resolvedSearchParams.brand_id === "string"
        ? resolvedSearchParams.brand_id
        : undefined,
    room_id:
      typeof resolvedSearchParams.room_id === "string"
        ? resolvedSearchParams.room_id
        : undefined,
  };

  let results;
  try {
    results = await getProductItems(params);
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

  const items = results?.data?.products || [];
  const paginationData = results?.data?.pagination;

  if (!items.length) {
    return (
      <NotFoundComponent message={results?.message || "No products found."} />
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
              <TableHead className="font-semibold min-w-[300px]">Product</TableHead>
              <TableHead className="font-semibold min-w-[100px]">Barcode</TableHead>
              <TableHead className="font-semibold min-w-[120px]">Category</TableHead>
              <TableHead className="font-semibold min-w-[120px]">Brand</TableHead>
              <TableHead className="font-semibold">Model</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item: ProductItem, index: number) => (
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
                      <PermissionGuard requiredPermission="edit-products">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/inventory-items/${item?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-products">
                        <DropdownMenuItem asChild>
                          <DeleteItemButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                {/* Product: Image + Name + Buy/MRP Price + Stock/Unit */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-100 flex-shrink-0">
                      <Image
                        src={item.image || "/images/placeholder.png"}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className="font-medium text-slate-900 truncate" title={item?.name}>
                        {truncate(item?.name, 28) || item?.name}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400">Buy:</span>
                        <span className="text-xs font-semibold text-slate-600">
                          {item?.purchase_price !== undefined && item?.purchase_price !== null
                            ? Number(item.purchase_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : "—"}
                        </span>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="text-xs text-slate-400">MRP:</span>
                        <span className="text-xs font-semibold text-emerald-600">
                          {item?.mrp_price !== undefined && item?.mrp_price !== null
                            ? Number(item.mrp_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Stock:</span>
                        <span className="text-xs font-semibold text-slate-700">{item?.stock ?? 0}</span>
                        {item?.unit_name && (
                          <span className="text-xs text-slate-400">{item.unit_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600">
                  {item?.barcode || "—"}
                </TableCell>

                <TableCell>
                  {getCategoryBadge(item?.category_name)}
                </TableCell>

                <TableCell>
                  {getBrandBadge(item?.brand_name)}
                </TableCell>

                <TableCell className="text-slate-600">
                  {item?.model || "—"}
                </TableCell>

                <TableCell className="text-center">
                  {getStatusBadge(item?.status)}
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

export default ItemsData;
