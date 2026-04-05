
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Division, getDivisions, District } from "@/apiServices/divisionService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

const DivisionData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
})=> {
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
  };

  let data;
  try {
    data = await getDivisions( params );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const divisions = data?.data?.divisions || [];

  if (!divisions.length) {
    return <NotFoundComponent message={data?.message} title="Division List" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead>Division Name</TableHead>
            <TableHead>Total Districts</TableHead>
            <TableHead>Districts</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {divisions.map((division: Division , index: number) => (
            <TableRow key={division.id}>
              <TableCell>{index + 1}</TableCell>
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
                      <PermissionGuard requiredPermission="view-divisions">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/divisions/${division?.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="edit-divisions">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/divisions/${division?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-divisions">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={division?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              <TableCell className="font-medium">{division.name}</TableCell>
              <TableCell>{division.districts_count}</TableCell>
              <TableCell>
                {division.districts?.length > 0 ? (
                  division.districts.map((district: District) => (
                    <span key={district.id} className="block">
                      {district.name}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">No districts</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export default DivisionData;
