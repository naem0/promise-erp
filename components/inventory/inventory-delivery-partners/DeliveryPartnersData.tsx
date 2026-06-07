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
import { DeliveryPartner, getDeliveryPartners } from "@/apiServices/inventoryDeliveryPartnersService";
import DeleteDeliveryPartnerButton from "./DeleteDeliveryPartnerButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

const DeliveryPartnersData = async ({
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
  };

  let results;
  try {
    results = await getDeliveryPartners(params);
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

  const deliveryPartners = results?.data?.delivery_partners || [];
  const paginationData = results?.data?.pagination;

  if (!deliveryPartners.length) {
    return (
      <NotFoundComponent message={results?.message || "No delivery partners found."} />
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
              <TableHead className="font-semibold min-w-[120px]">Contact</TableHead>
              <TableHead className="font-semibold min-w-[180px]">Email</TableHead>
              <TableHead className="font-semibold min-w-[200px]">Description</TableHead>
              <TableHead className="font-semibold min-w-[200px]">Address</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deliveryPartners.map((partner: DeliveryPartner, index: number) => (
              <TableRow key={`${partner?.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
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
                      <PermissionGuard requiredPermission="edit-delivery-partners">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/inventory/inventory-delivery-partners/${partner?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-delivery-partners">
                        <DropdownMenuItem asChild>
                          <DeleteDeliveryPartnerButton id={partner?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {partner?.name}
                </TableCell>

                <TableCell className="text-slate-700 font-medium">
                  {partner?.contact}
                </TableCell>

                <TableCell className="text-slate-600">
                  {partner?.email || "—"}
                </TableCell>

                <TableCell className="text-slate-600" title={partner?.description || ""}>
                  {partner?.description ? truncate(partner.description, 40) : "—"}
                </TableCell>

                <TableCell className="text-slate-600" title={partner?.address || ""}>
                  {partner?.address ? truncate(partner.address, 40) : "—"}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      Number(partner?.status) === 1
                        ? "bg-green-50 text-green-700 border-green-100 font-medium"
                        : "bg-red-50 text-red-700 border-red-100 font-medium"
                    }
                  >
                    {partner?.status_text || (Number(partner?.status) === 1 ? "Active" : "Inactive")}
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

export default DeliveryPartnersData;
