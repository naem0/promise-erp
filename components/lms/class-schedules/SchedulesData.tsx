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
import { ClassSchedule, getClassSchedules } from "@/apiServices/classSchedulesService";
import DeleteButton from "./DeleteButton";
import ToggleClassScheduleStatusButton from "./ToggleClassScheduleStatusButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const SchedulesData = async ({
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
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
  };

  let results;
  try {
    results = await getClassSchedules(params);
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

  const schedules = results?.data?.class_schedules || [];
  const paginationData = results?.data?.pagination;

  if (!schedules?.length) {
    return (
      <NotFoundComponent message={results?.message || "No class schedules found."} />
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
              <TableHead className="font-semibold min-w-[200px]">Title</TableHead>
              <TableHead className="font-semibold min-w-[120px]">Start Time</TableHead>
              <TableHead className="font-semibold min-w-[120px]">End Time</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {schedules?.map((schedule: ClassSchedule, index: number) => (
              <TableRow key={`${schedule?.id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
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
                      <PermissionGuard requiredPermission="edit-class-schedules">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/class-schedules/${schedule?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-class-schedules">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={schedule?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {schedule?.title}
                </TableCell>

                <TableCell className="text-slate-600 font-medium">
                  {schedule?.start_time || "—"}
                </TableCell>

                <TableCell className="text-slate-600 font-medium">
                  {schedule?.end_time || "—"}
                </TableCell>

                <TableCell className="text-center">
                  <PermissionGuard
                    requiredPermission="toggle-class-schedule-status"
                    fallback={
                      <Badge
                        className={
                          Number(schedule?.status) === 1
                            ? "bg-green-50 text-green-700 border-green-100 font-medium"
                            : "bg-red-50 text-red-700 border-red-100 font-medium"
                        }
                      >
                        {schedule?.status_text || (Number(schedule?.status) === 1 ? "Active" : "Inactive")}
                      </Badge>
                    }
                  >
                    <ToggleClassScheduleStatusButton
                      id={schedule?.id}
                      currentStatus={schedule?.status}
                    />
                  </PermissionGuard>
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

export default SchedulesData;
