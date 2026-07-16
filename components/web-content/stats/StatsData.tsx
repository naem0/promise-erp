import { getStats, Stats } from "@/apiServices/statsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Settings } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import { StatsSearchParamsProps } from "@/app/(admin-dashboard)/web-content/stats/page";
import DeleteStatButton from "@/components/web-content/stats/DeleteStatButton";
import PermissionGuard from "@/components/auth/PermissionGuard";

// Format type helper
const formatType = (type: string) => {
  switch (type) {
    case "achievement_stat":
      return { label: "Achievement", className: "bg-purple-100 text-purple-700 hover:bg-purple-200" };
    case "hero_stat":
      return { label: "Hero", className: "bg-blue-100 text-blue-700 hover:bg-blue-200" };
    case "opportunity_stat":
      return { label: "Opportunity", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" };
    default:
      return { label: type, className: "bg-slate-100 text-slate-700" };
  }
};

export default async function StatsData({
  searchParams,
}: StatsSearchParamsProps) {
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

  let data;
  try {
    data = await getStats(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return (
        <ErrorComponent
          message={data?.message ?? "An unexpected error occurred."}
        />
      );
    }
  }

  if (!data || !data.data) {
    return null;
  }

  const stats = data?.data?.stats ?? [];
  const pagination = data?.data?.pagination ?? {};

  if (stats.length === 0) {
    return <NotFoundComponent message={data?.message ?? "No stats found."} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[60px] text-center font-medium">#</TableHead>
              <TableHead className="w-[81px] text-center font-medium">Image</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Count</TableHead>
              <TableHead className="w-[100px] text-center font-medium">Status</TableHead>
              <TableHead className="w-[100px] text-center font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stats?.map((statData: Stats, index: number) => {
              const typeConfig = formatType(statData.type);
              
              return (
                <TableRow key={statData?.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-500">
                    {(pagination.current_page - 1) * pagination.per_page +
                      index +
                      1}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="relative w-10 h-10 mx-auto rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                      <Image
                        src={statData?.image || "/images/placeholder.png"}
                        alt={statData?.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm font-medium text-slate-900">
                      {statData?.title}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] font-medium px-2 py-0.5 border-transparent ${typeConfig.className}`}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-700">
                      {statData?.count ?? 0}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        statData?.status === 1 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      }
                    >
                      {statData?.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-slate-100 rounded-md transition-colors outline-none focus:ring-2 focus:ring-slate-200">
                          <Settings className="w-4 h-4 text-slate-500" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40 shadow-lg rounded-xl">
                        <PermissionGuard requiredPermission="view-stats">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/web-content/stats/${statData?.id}`}
                              className="flex items-center cursor-pointer px-2 py-1.5 text-sm"
                            >
                              <Eye className="mr-2 h-4 w-4 text-slate-500" />
                              <span>Details</span>
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="edit-stats">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/web-content/stats/${statData?.id}/edit`}
                              className="flex items-center cursor-pointer px-2 py-1.5 text-sm"
                            >
                              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="delete-stats">
                          <div className="border-t border-slate-100 my-1"></div>
                          <DeleteStatButton id={statData?.id} />
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.last_page > 1 && (
        <Pagination pagination={pagination} />
      )}
    </div>
  );
}
