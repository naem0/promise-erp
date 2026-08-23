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
import { getNewsFeeds, NewsFeed } from "@/apiServices/homePageAdminService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const NewsFeedsData = async ({
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
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getNewsFeeds(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results.success) {
    return <ErrorComponent message={results?.message || "Failed to load news feeds."} />;
  }

  const newsFeeds = results?.data?.news_feeds || [];
  const paginationData = results?.data?.pagination;

  if (!newsFeeds || newsFeeds.length === 0) {
    return <NotFoundComponent message={results?.message || "No news feeds found."} />;
  }

  return (
    <div className="rounded-md border">
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">News Link</TableHead>
            <TableHead className="text-center">Published At</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {newsFeeds.map((item: NewsFeed, index: number) => {
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
                      <PermissionGuard requiredPermission="edit-news-feeds">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/news-feeds/${item.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-news-feeds">
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
                    alt={item.title || `News Feed ${item.id}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  <a
                    href={item.news_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {item.news_link}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(item.created_at).toLocaleDateString()}
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

      {paginationData && (
        <div className="mt-4 py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default NewsFeedsData;
