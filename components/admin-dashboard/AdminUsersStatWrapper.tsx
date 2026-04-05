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

  // Curated colors — used first; extras generated dynamically (avoiding red)
  const palette = [
    "#00B686", // green
    "#2D76E5", // blue
    "#9148EF", // purple
    "#E67E00", // orange
    "#E64A6E", // pink
    "#00B8E6", // cyan
  ];

  const getCardColor = (index: number): string => {
    if (index < palette.length) return palette[index];
    // For extra cards: spread hue across non-red range (160°–340°)
    const extraIndex = index - palette.length;
    const hue = 160 + Math.round((extraIndex / Math.max(1, stats.length - palette.length)) * 180);
    return `hsl(${hue}, 65%, 45%)`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 py-5">
      {stats.length > 0 ? (
        stats.map((stat, index) => (
          <AdminUsersStat
            key={index}
            title={stat?.card_name}
            allStats={stat?.card_data}
            bgColor={getCardColor(index)}
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
