import AdminUsersStat from "./AdminUsersStat";
import {
  DashboardSummaryData,
  getDashboardSummaryStats,
} from "@/apiServices/adminDashboardService";
import ErrorComponent from "../common/ErrorComponent";
import NotFoundComponent from "../common/NotFoundComponent";
import DashboardRunningBatches from "./DashboardRunningBatches";

const AdminUsersStatWrapper = async () => {
  let summaryStats;
  try {
    summaryStats = await getDashboardSummaryStats();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={error.message || "An unknown error occurred"}
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={summaryStats?.message || "An unknown error occurred"}
          />
        </div>
      );
    }
  }

  const stats: DashboardSummaryData | null = summaryStats?.data ?? null;
  const totalSumaryInfo = stats?.summary_stats ?? [];
  const chartsAnalytics = stats?.charts_analytics ?? [];
  const courseNoticeResult = stats?.course_notice_result ?? [];
  const runningBatches = stats?.running_batches ?? [];
  const divisionalIncomeReport = stats?.divisional_income_report ?? [];

  if (!summaryStats || !summaryStats.success || !summaryStats.data) {
    return null;
  }

  // Curated colors — used first; extras generated dynamically (avoiding red)
  const palette = [
    "#00B686", // green
    "#2D76E5", // blue
    "#9148EF", // purple
    "#E67E00", // orange
    "#E64A6E", // pink
    "#00B8E6", // cyan
  ];

  console.log("stats----->>>", stats);

  const getCardColor = (index: number): string => {
    if (index < palette.length) return palette[index];
    // For extra cards: spread hue across non-red range (160°–340°)
    const extraIndex = index - palette.length;
    const hue =
      160 +
      Math.round(
        (extraIndex / Math.max(1, totalSumaryInfo?.length - palette.length)) *
          180,
      );
    return `hsl(${hue}, 65%, 45%)`;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 py-5">
        {totalSumaryInfo?.length > 0 ? (
          totalSumaryInfo?.map((stat, index) => (
            <AdminUsersStat
              key={index}
              title={stat?.card_name}
              allStats={stat?.card_data}
              bgColor={getCardColor(index)}
            />
          ))
        ) : (
          null
        )}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 px-4 py-5">
        {/* LEFT SIDE (Table) */}
        <div className="xl:col-span-2">
          {runningBatches?.length > 0 ? (
            <DashboardRunningBatches runningBatches={runningBatches} />
          ) : null}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* System Notice */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h1 className="text-base font-semibold mb-2">System Notice</h1>
            <p className="text-sm md:text-base text-gray-600">
              Notice content...
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl shadow p-4">
            <h1 className="text-base font-semibold mb-2">Expenses</h1>
            <p className="text-sm md:text-base">Expenses content...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsersStatWrapper;
