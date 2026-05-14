import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
  getCRMNotifications,
  CRMNotification,
} from "@/apiServices/crmNotification";
import Pagination from "@/components/common/Pagination";
import CRMNotificationCard from "./CRMNotificationCard";
import { BellRing, Inbox } from "lucide-react";

const CRMNotificationsData = async ({
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

  let results;
  try {
    results = await getCRMNotifications({ page, per_page });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 lg:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="py-8 lg:py-12">
          <ErrorComponent message="An unknown error occurred while fetching notifications." />
        </div>
      );
    }
  }

  if (!results || !results.success || !results.data) {
    return null;
  }

  const notifications: CRMNotification[] = results?.data?.notifications || [];
  const unreadCount = results?.data?.unread_count ?? 0;
  const totalCount = results?.data?.pagination?.total ?? notifications.length;
  const paginationData = results?.data?.pagination;

  if (!notifications.length) {
    return (
      <NotFoundComponent
        message={results.message || "No notifications found."}
      />
    );
  }

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80">
            Total
          </p>
          <p className="mt-1 text-3xl font-bold">{totalCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-4 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80">
            Unread
          </p>
          <p className="mt-1 text-3xl font-bold">{unreadCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80">
            Read
          </p>
          <p className="mt-1 text-3xl font-bold">{totalCount - unreadCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80">
            This Page
          </p>
          <p className="mt-1 text-3xl font-bold">{notifications.length}</p>
        </div>
      </div>

      {/* Main Panel */}
      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-md">
        {/* Header */}
        <div className="relative border-b flex items-center gap-3 overflow-hidden bg-linear-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <BellRing className="h-8 w-8 bg-secondary text-white p-1 rounded-lg" />
          </div>
          <div>
            <h2 className="text-base font-bold text-secondary leading-tight mb-2">
              Consultant Notifications
            </h2>
            <p className="text-xs text-secondary/80">
              Follow-up alerts & lead updates
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="ml-auto flex items-center gap-2 rounded-full bg-rose-500 px-3 py-1 shadow-lg">
              <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
              <span className=" font-bold text-white">
                {unreadCount} Unread
              </span>
            </div>
          )}
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b bg-linear-gradient-to-r from-violet-50 to-indigo-50 px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary/80">
          <span>Type</span>
          <span>Message &amp; Details</span>
          <span className="text-right">Status</span>
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-2 p-3 bg-slate-50/30">
          {notifications?.map((notification: CRMNotification, index: number) => (
            <CRMNotificationCard
              key={notification.id}
              notification={notification}
              index={index}
            />
          ))}
        </div>
      </div>

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default CRMNotificationsData;
