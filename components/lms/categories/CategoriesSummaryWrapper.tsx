import { getCourseCategoryStats, CourseCategoryStatsResponse } from "@/apiServices/courseCategory";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { LayoutGrid, TrendingUp, Users, Award } from "lucide-react";

const CategoriesSummaryWrapper = async () => {
  let stats: CourseCategoryStatsResponse | null = null;

  try {
    stats = await getCourseCategoryStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching course category stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch course category stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  const iconList = [LayoutGrid, TrendingUp, Users, Award];
  const mappedData = stats.data.map((item, index) => ({
    ...item,
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default CategoriesSummaryWrapper;
