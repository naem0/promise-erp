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
import { Achievement, getAchievements } from "@/apiServices/achievementsService";
import DeleteAchievementButton from "./DeleteAchievementButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";
import Image from "next/image";

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

const AchievementsData = async ({
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
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getAchievements(params);
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

  const items = results?.data?.achievements || [];
  const paginationData = results?.data?.pagination;

  if (!items.length) {
    return (
      <NotFoundComponent message={results?.message || "No achievements found."} />
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
              <TableHead className="font-semibold min-w-[250px]">Profile</TableHead>
              <TableHead className="font-semibold min-w-[350px]">Title & Description</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item: Achievement, index: number) => (
              <TableRow key={`${item?.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-center text-slate-500 font-medium">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="default"
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                      >
                        Action
                      </Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                      <PermissionGuard requiredPermission="edit-achievements">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/web-content/about-page/achievements/${item?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-achievements">
                        <DropdownMenuItem asChild>
                          <DeleteAchievementButton id={item?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-100 flex-shrink-0">
                      <Image
                        src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className="font-medium text-slate-900 truncate" title={item?.name}>
                        {truncate(item?.name, 30) || item?.name}
                      </span>
                      <span className="text-xs text-slate-500 truncate" title={item?.designation}>
                        {item?.designation}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col min-w-0 gap-0.5">
                    <span className="font-medium text-slate-800 truncate" title={item?.title}>
                      {truncate(item?.title, 50) || item?.title}
                    </span>
                    <span className="text-xs text-slate-500 whitespace-pre-wrap" title={item?.description}>
                      {truncate(item?.description, 100) || item?.description}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {getStatusBadge(item?.status)}
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

export default AchievementsData;
