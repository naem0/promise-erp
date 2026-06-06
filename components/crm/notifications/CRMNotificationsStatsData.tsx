import { getCRMNotifications } from "@/apiServices/crmNotification";

export function CRMNotificationsStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse bg-slate-100 rounded-2xl border"
        />
      ))}
    </div>
  );
}

const CRMNotificationsStatsData = async ({
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
      : 30;
  const course =
    typeof resolvedSearchParams.course === "string" && resolvedSearchParams.course.trim() !== ""
      ? Number(resolvedSearchParams.course)
      : typeof resolvedSearchParams.course_id === "string" && resolvedSearchParams.course_id.trim() !== ""
        ? Number(resolvedSearchParams.course_id)
        : undefined;

  const params = {
    page,
    per_page,
    course,
  };

  let results;
  try {
    results = await getCRMNotifications(params);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  if (!results || !results.success || !results.data) {
    return null;
  }

  const notifications = results?.data?.notifications || [];
  const unreadCount = results?.data?.unread_count ?? 0;
  const totalCount = results?.data?.pagination?.total ?? notifications.length;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Total */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">
          Total
        </p>
        <p className="mt-1 text-3xl font-bold">{totalCount}</p>
      </div>

      {/* Unread */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">
          Unread
        </p>
        <p className="mt-1 text-3xl font-bold">{unreadCount}</p>
      </div>

      {/* Read */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">
          Read
        </p>
        <p className="mt-1 text-3xl font-bold">{totalCount - unreadCount}</p>
      </div>

      {/* This Page */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">
          This Page
        </p>
        <p className="mt-1 text-3xl font-bold">{notifications.length}</p>
      </div>
    </div>
  );
};

export default CRMNotificationsStatsData;
