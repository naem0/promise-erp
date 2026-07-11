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
import {
  getCommonSections,
  CommonSection,
  deleteCommonSection,
} from "@/apiServices/homePageAdminService";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import DeleteButton from "@/components/common/DeleteButton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

// =======================
// Type badge color map
// =======================
const TYPE_COLOR_MAP: Record<string, string> = {
  // Content types
  course_category:      "bg-blue-50 text-blue-700 border-blue-100",
  service:              "bg-green-50 text-green-700 border-green-100",
  popular_course:       "bg-purple-50 text-purple-700 border-purple-100",
  govt_course:          "bg-orange-50 text-orange-700 border-orange-100",
  opportunity:          "bg-teal-50 text-teal-700 border-teal-100",
  trainer:              "bg-pink-50 text-pink-700 border-pink-100",
  video_gallery:        "bg-red-50 text-red-700 border-red-100",
  blog:                 "bg-indigo-50 text-indigo-700 border-indigo-100",
  success_story:        "bg-yellow-50 text-yellow-700 border-yellow-100",
  news_feed:            "bg-cyan-50 text-cyan-700 border-cyan-100",
  partner:              "bg-emerald-50 text-emerald-700 border-emerald-100",
  news_letter:          "bg-violet-50 text-violet-700 border-violet-100",
  branch:               "bg-amber-50 text-amber-700 border-amber-100",
  why_choose_us:        "bg-sky-50 text-sky-700 border-sky-100",
  mission:              "bg-rose-50 text-rose-700 border-rose-100",
  vision:               "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  value:                "bg-lime-50 text-lime-700 border-lime-100",
  // Banner types
  about_banner:         "bg-sky-50 text-sky-800 border-sky-200",
  service_banner:       "bg-teal-50 text-teal-800 border-teal-200",
  blog_banner:          "bg-indigo-50 text-indigo-800 border-indigo-200",
  blog_details_banner:  "bg-indigo-50 text-indigo-700 border-indigo-100",
  blog_category_banner: "bg-blue-50 text-blue-800 border-blue-200",
  contact_banner:       "bg-green-50 text-green-800 border-green-200",
  image_gallery_banner: "bg-purple-50 text-purple-800 border-purple-200",
  job_banner:           "bg-orange-50 text-orange-800 border-orange-200",
  job_banner_details:   "bg-orange-50 text-orange-700 border-orange-100",
  our_officers_banner:  "bg-pink-50 text-pink-800 border-pink-200",
  success_story_banner: "bg-yellow-50 text-yellow-800 border-yellow-200",
  trainer_banner:       "bg-rose-50 text-rose-800 border-rose-200",
  video_gallery_banner: "bg-red-50 text-red-800 border-red-200",
  privacy_banner:       "bg-slate-50 text-slate-700 border-slate-200",
  terms_banner:         "bg-gray-50 text-gray-700 border-gray-200",
  jubo_banner:          "bg-emerald-50 text-emerald-800 border-emerald-200",
  jubo_details_banner:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  // Fallback
  none:                 "bg-slate-50 text-slate-600 border-slate-100",
};

const getTypeBadge = (type: string) => {
  const colorClass =
    TYPE_COLOR_MAP[type] ?? "bg-slate-50 text-slate-600 border-slate-100";
  const label = type
    ? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";
  return (
    <Badge
      variant="secondary"
      className={`${colorClass} font-normal capitalize`}
    >
      {label}
    </Badge>
  );
};

const getStatusBadge = (status: number | string | undefined) => {
  switch (Number(status)) {
    case 1:
      return (
        <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50 font-medium">
          Active
        </Badge>
      );
    case 0:
      return (
        <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-medium">
          Inactive
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50 font-medium">
          Unknown
        </Badge>
      );
  }
};

// =======================
// Component
// =======================

const CommonSectionsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    type:
      typeof resolvedSearchParams.type === "string"
        ? resolvedSearchParams.type
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
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

  if (!results || !results?.data) {
    return null;
  }

  const sections = results?.data?.sections || [];
  const paginationData = results?.data?.pagination;

  if (!sections.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No common sections found."}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
              <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
              <TableHead className="font-semibold w-[80px]">Image</TableHead>
              <TableHead className="font-semibold min-w-[180px]">Title</TableHead>
              <TableHead className="font-semibold min-w-[200px]">Sub Title</TableHead>
              <TableHead className="font-semibold min-w-[130px]">Type</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sections.map((item: CommonSection, index: number) => (
              <TableRow
                key={`${item.id}-${index}`}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Serial Number */}
                <TableCell className="text-center text-slate-500 font-medium">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>

                {/* Action */}
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
                      <PermissionGuard requiredPermission="edit-sections">
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

                      <PermissionGuard requiredPermission="delete-sections">
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

                {/* Image */}
                <TableCell>
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-100 flex-shrink-0">
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.title || `Section ${item.id}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <span
                    className="font-medium text-slate-900 truncate block max-w-[180px]"
                    title={item.title}
                  >
                    {truncate(item.title, 35)}
                  </span>
                </TableCell>

                {/* Sub Title */}
                <TableCell>
                  <span
                    className="text-sm text-slate-600 truncate block max-w-[200px]"
                    title={item.sub_title}
                  >
                    {truncate(item.sub_title, 50)}
                  </span>
                </TableCell>

                {/* Type */}
                <TableCell>{getTypeBadge(item.type)}</TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default CommonSectionsData;
