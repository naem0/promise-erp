import { deleteBlogCategory, getBlogCategories } from "@/apiServices/blogCategoryService";
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
import Link from "next/link";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import DeleteButton from "@/components/common/DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface BlogCategoriesParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const BlogCategoriesData = async ({
  searchParams,
}: BlogCategoriesParamsProps) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string"
    ? Number(resolvedSearchParams.page) : 1;

  const params = {
    page,
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    sort_order: typeof resolvedSearchParams.sort_order === "string" ? resolvedSearchParams.sort_order : undefined,
    status: typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
  };

  let results;
  try {
    results = await getBlogCategories(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const blog_categories = results?.data?.blog_categories || [];
  const pagination = results?.data?.pagination;

  if (blog_categories.length === 0) {
    return (
      <NotFoundComponent
        message={results?.message || "No blog categories found."}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blog_categories.map((blog_category, index) => (
            <TableRow key={blog_category.id}>
              <TableCell>
                {(pagination.current_page - 1) * pagination.per_page + index + 1}
              </TableCell>
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
                    <PermissionGuard requiredPermission="edit-blog-categories">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/web-content/blog-categories/${blog_category?.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="delete-blog-categories">
                      <DropdownMenuItem asChild>
                        <DeleteButton
                          id={blog_category?.id}
                          deleteAction={deleteBlogCategory}
                          itemName="blog category"
                        />
                      </DropdownMenuItem>
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{blog_category.title}</TableCell>
              <TableCell>
                <Image
                  src={(blog_category?.image && typeof blog_category?.image === "string" && blog_category?.image.trim() !== "") ? blog_category?.image : "/images/placeholder.png"}
                  alt={blog_category?.title}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    blog_category?.status === 1 ? "default" : "destructive"
                  }
                >
                  {blog_category?.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
};

export default BlogCategoriesData;
