import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { getPartners, Partner } from "@/apiServices/homePageAdminService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const OurPartnersData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string" && resolvedSearchParams.status !== ""
        ? Number(resolvedSearchParams.status)
        : undefined,
    partner_type:
      typeof resolvedSearchParams.partner_type === "string" && resolvedSearchParams.partner_type !== ""
        ? Number(resolvedSearchParams.partner_type)
        : undefined,
    per_page: 15,
  };

  let results;
  try {
    results = await getPartners(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results.success) {
    return <ErrorComponent message={results?.message || "Failed to load partners."} />;
  }

  const partners = results?.data?.partners || [];
  const paginationData = results?.data?.pagination;

  if (!partners || partners.length === 0) {
    return <NotFoundComponent message={results?.message || "No partners found."} />;
  }

  // Partner type configuration mapping
  const partnerTypeMap: Record<number, { label: string; color: string }> = {
    1: { label: "Affiliate", color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300" },
    2: { label: "Concern", color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300" },
    3: { label: "Client", color: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300" },
    4: { label: "Member", color: "bg-secondary text-white" },
  };

  const getPartnerTypeInfo = (type: number) =>
    partnerTypeMap[type] || { label: "Unknown", color: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300" };

  return (
    <div className="rounded-md border">
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Partner Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {partners.map((item: Partner, index: number) => {
            const partnerInfo = getPartnerTypeInfo(Number(item.partner_type));
            return (
              <TableRow key={item.id}>
                <TableCell className="text-center">{(page - 1) * 15 + (index + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="edit-partners">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/our-partners/${item.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-partners">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={item.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center">
                  <Image
                    src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                    alt={item.title || `Partner ${item.id}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={partnerInfo.color}
                  >
                    {partnerInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={Number(item.status) === 1 ? "outline" : "destructive"}>
                    {Number(item.status) === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {paginationData && (
        <div className="mt-4 py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default OurPartnersData;
