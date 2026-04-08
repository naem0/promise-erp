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
import { getVideoGalleries, VideoGallery } from "@/apiServices/homePageAdminService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const VideoGalleryData = async ({
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
    results = await getVideoGalleries(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const videoGalleries = results?.data?.video_galleries || [];
  const paginationData = results?.data?.pagination;
  if (!videoGalleries.length) {
    return <NotFoundComponent message={results?.message || "No video galleries found."} />;
  }

  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Thumbnail</TableHead>
            <TableHead className="text-center">YouTube Link</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {videoGalleries.map((item: VideoGallery, index: number) => {
            const displayThumbnail = item.thumbnail_image;
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
                      <PermissionGuard requiredPermission="edit-video-galleries">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/video-galleries/${item.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-video-galleries">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={item.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center">
                  {displayThumbnail ? (
                    <Image
                      src={displayThumbnail}
                      alt={`Video ${item.id}`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted border rounded flex items-center justify-center text-[10px] text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-center max-w-[300px] truncate">
                  <a href={item.youtube_link || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {item.youtube_link}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {item.type === 1 ? "Success" : "Video"}
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
    {paginationData && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
    
  );
};

export default VideoGalleryData;
