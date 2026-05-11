import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { getAllPermissionsList } from "@/apiServices/rolePermissionService";
import ErrorComponent from "../common/ErrorComponent";
import Pagination from "../common/Pagination";

const PermissionListData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const params = {
    page: page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
  };

  const permissionsResponse = await getAllPermissionsList({ params });
  const permissions = permissionsResponse?.data?.permissions || [];
  const paginationData = permissionsResponse?.data?.pagination;

  if (!permissionsResponse.success) {
    return <ErrorComponent message={permissionsResponse.message} />;
  }
  if (!permissions.length) {
    return <ErrorComponent message={permissionsResponse.message} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-center">Sl</TableHead>
            <TableHead className="font-semibold text-left">
              Permission Name{" "}
            </TableHead>
            <TableHead className="font-semibold text-left">Roles</TableHead>
            <TableHead className="font-semibold text-center">
              Created Date
            </TableHead>
            <TableHead className="font-semibold text-center">
              Updated Date
            </TableHead>
            <TableHead className="font-semibold text-center">
              Roles Count
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {permissions?.map((permission, index) => (
            <TableRow key={permission.id}>
              <TableCell className="text-center">
                {(page - 1) * 15 + (index + 1)}
              </TableCell>

              <TableCell className="font-medium text-left">
                {permission?.name}
              </TableCell>
              <TableCell className=" flex flex-wrap gap-1">
                {permission.roles.map((role) => (
                  <Badge key={role}>{role}</Badge>
                ))}
              </TableCell>

              <TableCell className="text-center">
                {permission?.created_at}
              </TableCell>
              <TableCell className="text-center">
                {permission?.updated_at}
              </TableCell>

              <TableCell className="text-center">
                <Badge variant="outline">{permission?.roles_count}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {paginationData && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default PermissionListData;
