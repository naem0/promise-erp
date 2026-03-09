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
import { Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Blog, getBlogs } from "@/apiServices/blogsService";
import DeleteBlogButton from "./DeleteBlogButton";
import Pagination from "@/components/common/Pagination";
interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const BlogsData = async ({ searchParams }: SearchParamsProps) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    blog_category_id:
      typeof resolvedSearchParams.blog_category_id === "string"
        ? resolvedSearchParams.blog_category_id
        : undefined,
  };

  let results;
  try {
    results = await getBlogs(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const blogs = results?.data?.blogs || [];
  const paginationData = results?.data?.pagination;

  if (!blogs.length) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message={results?.message || "No blogs found."} />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Thumbnail</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Author</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Published At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog: Blog, index: number) => (
            <TableRow key={blog?.id}>
              <TableCell className="text-center">
                {(page - 1) * 15 + (index + 1)}
              </TableCell>
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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/lms/blogs/${blog?.id}/edit`}
                        className="flex items-center cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Manage
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DeleteBlogButton id={blog?.id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="font-medium flex items-center justify-center">
                <Image
                  src={blog.thumbnail || "/images/placeholder.png"}
                  alt={blog?.title}
                  width={60}
                  height={40}
                  className="object-cover rounded h-10 w-16"
                />
              </TableCell>
              <TableCell className="font-medium text-center max-w-[200px]">
                <div className="flex flex-col">
                  <span className="truncate">{blog?.title}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    /{blog?.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {blog?.category?.title || "—"}
              </TableCell>
              <TableCell className="text-center">
                {blog?.author?.name || "—"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={blog.status === 1 ? "default" : "secondary"}>
                  {blog.status === 1 ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {blog?.published_at || "—"}
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

export default BlogsData;
