import {
  deleteCareerCategory,
  getCareerCategories,
} from "@/apiServices/careerCategoryService";
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
import Pagination from "@/components/common/Pagination";
import DeleteButton from "@/components/common/DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface CareerCategoriesParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CareerCategoriesData = async ({
  searchParams,
}: CareerCategoriesParamsProps) => {
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
    per_page,
  };

  let results;
  try {
    results = await getCareerCategories(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const career_categories = results?.data?.career_categories || [];
  const pagination = results?.data?.pagination;

  if (career_categories.length === 0) {
    return (
      <NotFoundComponent
        message={results?.message || "No career categories found."}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Meta Tags</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {career_categories.map((career_category, index) => (
              <TableRow key={career_category.id}>
                <TableCell>
                  {(pagination.current_page - 1) * pagination.per_page +
                    index +
                    1}
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
                      <PermissionGuard requiredPermission="edit-career-category">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/career-categories/${career_category?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-career-category">
                        <DropdownMenuItem asChild>
                          <DeleteButton
                            id={career_category?.id}
                            deleteAction={deleteCareerCategory}
                            itemName="career category"
                          />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{career_category.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {career_category.slug || "—"}
                </TableCell>
                <TableCell>{career_category.meta_title || "—"}</TableCell>
                <TableCell>
                  {career_category.meta_tag?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {career_category.meta_tag.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      career_category?.status === 1 ? "default" : "destructive"
                    }
                  >
                    {career_category?.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex justify-end mt-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
};

export default CareerCategoriesData;
