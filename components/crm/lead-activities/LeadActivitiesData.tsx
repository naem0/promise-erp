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
import { Badge } from "@/components/ui/badge";
import {
  LeadActivity,
  getLeadsActivity,
} from "@/apiServices/crmLeadActivitiesService";
import Pagination from "@/components/common/Pagination";
import LeadActivityAction from "./LeadActivitiesAction";

import { truncate } from "@/lib/utils";
import Link from "next/link";
import PermissionGuard from "@/components/auth/PermissionGuard";

const LeadsActivityData = async ({
  resolvedSearchParams,
  queryString,
}: {
  resolvedSearchParams: { [key: string]: string | string[] | undefined };
  queryString: string;
}) => {
  const queryStr = queryString ? `?${queryString}` : "";

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
    user_id:
      typeof resolvedSearchParams.user_id === "string"
        ? resolvedSearchParams.user_id
        : undefined,
    course_id:
      typeof resolvedSearchParams.course_id === "string"
        ? resolvedSearchParams.course_id
        : undefined,
    date_from:
      typeof resolvedSearchParams.date_from === "string"
        ? resolvedSearchParams.date_from
        : undefined,
    date_to:
      typeof resolvedSearchParams.date_to === "string"
        ? resolvedSearchParams.date_to
        : undefined,
  };

  let results;
  try {
    results = await getLeadsActivity(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const activities = results?.data?.activities || [];
  const paginationData = results?.data?.pagination;

  if (!activities.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No leads activity found."}
      />
    );
  }

  const getStatusStyles = (status: number) => {
    switch (status) {
      case 1:
        return "border-[#2D76E5]/20 text-[#2D76E5] bg-[#2D76E5]/10";
      case 2:
        return "border-[#E67E00]/20 text-[#E67E00] bg-[#E67E00]/10";
      case 3:
        return "border-secondary/20 text-secondary bg-secondary/10";
      case 4:
        return "border-[#9148EF]/20 text-[#9148EF] bg-[#9148EF]/10";
      case 5:
        return "border-primary/20 text-primary bg-primary/10";
      case 6:
        return "border-red-500/20 text-red-500 bg-red-500/10";
      case 7:
        return "border-red-400/20 text-red-400 bg-red-400/10";
      case 8:
        return "border-orange-400/20 text-orange-400 bg-orange-400/10";
      case 9:
        return "border-[#6366F1]/20 text-[#6366F1] bg-[#6366F1]/10";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-center">Lead Name</TableHead>
              <TableHead className="text-center">Course</TableHead>
              <TableHead className="text-center">Lead Created Date</TableHead>
              <TableHead className="text-center">Last Follow Up</TableHead>
              <TableHead className="text-center">Next Follow Up</TableHead>
              <TableHead className="text-center">Calls</TableHead>
              <TableHead className="text-center">Messages</TableHead>
              <TableHead className="text-center">Counsellor</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">last Activity</TableHead>
              <TableHead className="text-center">Note</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activities.map((activity: LeadActivity, index: number) => (
              <TableRow key={activity?.id}>
                <TableCell className="text-center">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>
                <TableCell className="text-center">
                  <PermissionGuard requiredPermission="create-lead-activities">
                    <Link
                      href={`/crm/lead-activities/${activity?.lead_id || activity?.id}/manage${queryStr}`}
                      className="inline-flex items-center rounded-md border px-3 py-1 text-sm bg-primary text-white"
                    >
                      Action
                    </Link>
                  </PermissionGuard>
                </TableCell>

                <TableCell className="text-center font-medium">
                  {activity?.lead_name}
                </TableCell>
                <TableCell
                  className="text-center"
                  title={activity?.course_name}
                >
                  {truncate(activity?.course_name || "—", 25)}
                </TableCell>
                <TableCell
                  className="text-center"
                >
                  {activity?.lead_created_date}
                </TableCell>
                <TableCell className="text-center">
                  {activity?.last_follow_up_date || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {activity?.next_follow_up_date || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {activity?.call_count ?? 0}
                </TableCell>
                <TableCell className="text-center">
                  {activity?.message_count ?? 0}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span>{activity?.user_name}</span>
                    <span className="text-xs text-secondary">
                      {activity?.user_designation}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={getStatusStyles(activity?.status)}
                  >
                    {activity?.status_text}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-center"
                >
                  {activity?.last_activity}
                </TableCell>
                <TableCell
                  className="max-w-[200px] text-center"
                  title={activity?.note}
                >
                  {truncate(activity?.note || "", 20)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default LeadsActivityData;
