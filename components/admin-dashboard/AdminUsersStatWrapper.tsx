import AdminUsersStat from "./AdminUsersStat";
import { getDashboardSummaryStats } from "@/apiServices/adminDashboardService";
import ErrorComponent from "../common/ErrorComponent";
import NotFoundComponent from "../common/NotFoundComponent";



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

  const stats = summaryStats?.data || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 py-5">
      {stats.length > 0 ? (
        stats.map((stat, index) => (
          <AdminUsersStat
            key={index}
            title={stat?.card_name}
            allStats={stat?.card_data}
          />
        ))
      ) : (
        <div className="py-8 md:py-12">
          <NotFoundComponent
            message={summaryStats?.message || "An unknown error occurred"}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsersStatWrapper;
