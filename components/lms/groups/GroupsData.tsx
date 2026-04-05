
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
import { Group, getGroups } from "@/apiServices/groupService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";


const GroupsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
})=> {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const params = {
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
    results = await getGroups( page, params );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const groups = results?.data?.groups || [];
  const pagination = results?.data?.pagination;
  
  if (!groups.length) {
    return <NotFoundComponent message={results?.message} title="Group List" />;
  }
  

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Total Students</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groups.map((group: Group , index: number) => (
            <TableRow key={group?.id}>
              <TableCell>{(page-1) * 15 + (index + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="view-groups">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/groups/${group?.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="edit-groups">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/groups/${group?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-groups">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={group?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium">{group?.group_name}</TableCell>
                <TableCell className="font-medium">{group?.branch?.name}</TableCell>
                <TableCell className="font-medium">{group?.course?.name}</TableCell>
                <TableCell className="font-medium">{group?.batch?.name}</TableCell>
                <TableCell className="font-medium">{group?.total_students}</TableCell>
                <TableCell className="font-medium">{group?.is_active ? 'Active' : 'Inactive'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
    {pagination && (
      <div className="mt-4">
        <Pagination pagination={pagination} />
      </div>
    )}
    </div>
  );  
  
}
export default GroupsData;
