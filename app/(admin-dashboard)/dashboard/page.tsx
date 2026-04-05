import AdminCourseTypeChart from "@/components/admin-dashboard/AdminCourseTypeChart";
import AdminModeProgress from "@/components/admin-dashboard/AdminModeProgress";
import AdminMonthlyRegistrationChart from "@/components/admin-dashboard/AdminMonthlyRegistrationChart";
import AdminCriticalAlert from "@/components/admin-dashboard/AdminCriticalAlert";
import AdminPerformanceTable from "@/components/admin-dashboard/AdminPerformanceTable";
import AdminRecentActivity from "@/components/admin-dashboard/AdminRecentActivity";
import AdminOfflineBatchSnapshot from "@/components/admin-dashboard/AdminOfflineBatchSnapshot";
import AdminCertificateStatus from "@/components/admin-dashboard/AdminCertificateStatus";
import AdminQuickSendAlert from "@/components/admin-dashboard/AdminQuickSendAlert";
import AdminUsersStatWrapper from "@/components/admin-dashboard/AdminUsersStatWrapper";
import { Suspense } from "react";
import AdminUsersStatSkeleton from "@/components/admin-dashboard/AdminUsersStatSkeleton";

const DashboardPage = () => {
  return (
          <div className="px-4 py-6">
        <div className="pb-2 px-4">
          <h1 className="text-secondary text-xl lg:text-2xl capitalize font-bold ">
            Dashboard
          </h1>
        </div>
        <Suspense
          fallback={
            <div className="grid xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <AdminUsersStatSkeleton key={i} />
              ))}
            </div>
          }
        >
          <AdminUsersStatWrapper />
        </Suspense>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 py-5">
          <Suspense fallback={<div className="h-[350px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminMonthlyRegistrationChart />
          </Suspense>
          <div className="space-y-6">
            <Suspense fallback={<div className="h-[200px] w-full bg-muted animate-pulse rounded-xl" />}>
              <AdminCourseTypeChart />
            </Suspense>
            <Suspense fallback={<div className="h-[150px] w-full bg-muted animate-pulse rounded-xl" />}>
              <AdminModeProgress />
            </Suspense>
          </div>
        </div>
        {/* Table + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 py-5">
          <Suspense fallback={<div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminPerformanceTable />
          </Suspense>
          <Suspense fallback={<div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminCriticalAlert />
          </Suspense>
        </div>
        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 py-5">
          <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminRecentActivity />
          </Suspense>
          <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminOfflineBatchSnapshot />
          </Suspense>
          <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminCertificateStatus />
          </Suspense>
          <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
            <AdminQuickSendAlert />
          </Suspense>
        </div>
      </div>
      );
};

export default DashboardPage;
