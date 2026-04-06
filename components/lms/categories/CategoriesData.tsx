
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
import { Category, getCategories } from "@/apiServices/categoryService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";


const CategoriesData = async ({

  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getCategories(params);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const categories = results?.data?.categories || [];
  const paginationData = results?.data?.pagination;
  if (!categories.length) {
    return <NotFoundComponent message={results?.message} title="Category List" />;
  }
  

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category: Category , index: number) => (
            <TableRow key={category?.id}>
              <TableCell>{(page-1) * 15 + (index + 1)}</TableCell>
              <TableCell>
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
                      <PermissionGuard requiredPermission="edit-course-categories">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/categories/${category?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-course-categories">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={category?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
              <TableCell className="font-medium">
                <Image
                  src={category.image || "/images/placeholder.png"}
                  alt={category?.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{category?.name}</TableCell>
              <TableCell>
                <Badge variant={category.status === 1 ? "outline" : "destructive"}>
                  {category.status === 1 ? "Active" : "Inactive"}
                </Badge>
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
}
export default CategoriesData;
