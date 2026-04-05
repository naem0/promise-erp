
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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { District, getDistricts } from "@/apiServices/districtService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";


const DistrictData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) => {
  const resolvedSearchParams = await searchParams;
  let page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
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
  };

  let results;
  try {
    results = await getDistricts(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const districts = results?.data?.districts || [];
  const pagination = results?.data?.pagination;


  if (!districts.length) {
    return <NotFoundComponent message={results?.message} title="District List" />;
  }


  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead>Division </TableHead>
              <TableHead>District </TableHead>
              <TableHead >Branch</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {districts.map((district: District, index: number) => (
              <TableRow key={district?.id}>
                <TableCell>{(page - 1) * 15 + (index + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="view-districts">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/districts/${district?.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="edit-districts">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/districts/${district?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-districts">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={district?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium">{district?.division?.name}</TableCell>
                <TableCell className="font-medium">{district?.name}</TableCell>
                <TableCell className="font-medium">
                  {district?.branches?.length > 0 ? (
                    <ul className="space-y-1">
                      {district?.branches?.map((branch, index: number) => (
                        <li key={branch?.id}>
                          {index + 1}: {branch?.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No Branch"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
export default DistrictData;

