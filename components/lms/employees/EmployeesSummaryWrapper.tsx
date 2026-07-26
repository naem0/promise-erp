import { getEmployeeStats, EmployeeStatsResponse } from "@/apiServices/employeeService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { Users, UserCheck, UserCog, CalendarDays, Briefcase, UserPlus } from "lucide-react";

const EmployeesSummaryWrapper = async () => {
  let stats: EmployeeStatsResponse | null = null;

  try {
    stats = await getEmployeeStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching employees stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch employees stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  const iconList = [Users, UserCheck, UserCog, CalendarDays, Briefcase, UserPlus];
  const mappedData = stats.data.map((item, index) => ({
    ...item,
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default EmployeesSummaryWrapper;
