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
import { getCommonSections, CommonSection, deleteCommonSection } from "@/apiServices/homePageAdminService";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import DeleteButton from "@/components/common/DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

// Function to get badge color based on type
const getTypeBadgeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    course_category: "bg-blue-500 hover:bg-blue-600 text-white",
    service: "bg-green-500 hover:bg-green-600 text-white",
    popular_course: "bg-purple-500 hover:bg-purple-600 text-white",
    govt_course: "bg-orange-500 hover:bg-orange-600 text-white",
    opportunity: "bg-teal-500 hover:bg-teal-600 text-white",
    trainer: "bg-pink-500 hover:bg-pink-600 text-white",
    video_gallery: "bg-red-500 hover:bg-red-600 text-white",
    blog: "bg-indigo-500 hover:bg-indigo-600 text-white",
    success_story: "bg-yellow-500 hover:bg-yellow-600 text-white",
    news_feed: "bg-cyan-500 hover:bg-cyan-600 text-white",
    partner: "bg-emerald-500 hover:bg-emerald-600 text-white",
    news_letter: "bg-violet-500 hover:bg-violet-600 text-white",
    branch: "bg-amber-500 hover:bg-amber-600 text-white",
    none: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return colorMap[type] || "bg-gray-500 hover:bg-gray-600 text-white";
};

const CommonSectionsData = async ({
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
    results = await getCommonSections(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results.success) {
    return <ErrorComponent message={results?.message || "Failed to load common sections."} />;
  }

  const sections = results?.data?.sections || [];
  const paginationData = results?.data?.pagination;

  if (!sections || sections.length === 0) {
    return <NotFoundComponent message={results?.message || "No common sections found."} />;
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
            <TableHead className="text-center">Sub Title</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sections.map((item: CommonSection, index: number) => {
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
                      <PermissionGuard requiredPermission="edit-common-sections">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/common-sections/${item.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-common-sections">
                        <DropdownMenuItem asChild>
                          <DeleteButton
                            id={item.id}
                            deleteAction={deleteCommonSection}
                            itemName="common section"
                          />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.title || `Section ${item.id}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {item.sub_title}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getTypeBadgeColor(item.type)}>
                    {item.type}
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

      {paginationData && (
        <div className="mt-4 py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default CommonSectionsData;
