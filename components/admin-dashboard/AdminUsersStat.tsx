import { DashboardCardItem } from "@/apiServices/adminDashboardService";
import { ChartNoAxesCombined } from "lucide-react";

interface StatCardProps {
  title?: string;
  allStats: DashboardCardItem[];
  bgColor?: string;
}

const AdminUsersStat = ({ allStats, title, bgColor }: StatCardProps) => {
  return (
    <div
      className="rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-500"
      style={{ backgroundColor: bgColor || "#6366f1" }}
    >
      <div className="pb-2 text-white text-2xl xl:text-3xl font-medium">
        <h3 className="flex items-center gap-2">
          <ChartNoAxesCombined />
          {title || "No Title"}
        </h3>
      </div>
      <div className="pb-2">
        <p className="text-white text-2xl xl:text-3xl font-bold">
          {" "}
          {allStats[0]?.value}
        </p>
      </div>
      <div className={`grid grid-cols-3 gap-2 `}>
        {allStats?.slice(1).map((stat, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 bg-black/20 rounded-lg py-2 px-3">
              <p className="text-white text-base mb-1">{stat.title}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersStat;
