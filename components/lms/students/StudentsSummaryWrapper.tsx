import { getStudentStats, StudentStatsResponse } from "@/apiServices/studentService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { GraduationCap, BookOpen, Building2, CircleDollarSign } from "lucide-react";

const StudentsSummaryWrapper = async () => {
  let stats: StudentStatsResponse | null = null;

  try {
    stats = await getStudentStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching students stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch students stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  const iconList = [GraduationCap, BookOpen, Building2, CircleDollarSign];
  const mappedData = stats.data.map((item, index) => ({
    ...item,
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default StudentsSummaryWrapper;
