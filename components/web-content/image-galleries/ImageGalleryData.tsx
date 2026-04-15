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
import { getImageGalleries, ImageGallery } from "@/apiServices/homePageAdminService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const ImageGalleryData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;
  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    type:
      typeof resolvedSearchParams.type === "string"
        ? resolvedSearchParams.type
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getImageGalleries(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const imageGalleries = results?.data?.image_galleries || [];
  const paginationData = results?.data?.pagination;
  console.log(paginationData);
  if (!imageGalleries.length) {
    return <NotFoundComponent message={results?.message || "No image galleries found."} />;
  }

  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Images</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {imageGalleries.map((item: ImageGallery, index: number) => {
            const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
            return (
              <TableRow key={item.id}>
                <TableCell className="text-center">{(page - 1) * per_page + (index + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="edit-image-galleries">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/image-galleries/${item.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-image-galleries">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={item.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium text-center max-w-[300px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center gap-1">
                  {firstImage ? (
                    <div className="flex items-center gap-1">
                      <Image
                        src={firstImage}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                      {item.images.length > 1 && (
                        <span className="text-xs text-muted-foreground">+{item.images.length - 1}</span>
                      )}
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-muted border rounded flex items-center justify-center text-[10px] text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {item.type === 1 ? "Gallery" : item.type === 2 ? "Achievement" : "Other"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={item.status === 1 ? "outline" : "destructive"}>
                    {item.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      
    </div>
    {paginationData?.has_more_pages && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
    
  );
};

export default ImageGalleryData;
