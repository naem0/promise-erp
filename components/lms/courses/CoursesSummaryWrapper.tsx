import { getCourseOverviewStats, CourseOverviewStatsResponse } from "@/apiServices/courseService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { GraduationCap, BookOpen, Layers, Star, Video, PlayCircle } from "lucide-react";
import { LmsDashboardStat } from "../LmsCommonSummary";

const CoursesSummaryWrapper = async () => {
  let stats: CourseOverviewStatsResponse | null = null;

  try {
    stats = await getCourseOverviewStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Failed to fetch course stats";

    return (
      <div className="py-10">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats || !stats.data) {
    return null;
  }

  const iconList = [GraduationCap, Layers, Star, BookOpen, Video, PlayCircle];


  const mappedData: LmsDashboardStat[] = stats?.data?.map((item, index) => {
    const metricsRecord: Record<string, number | string> = {
      value: item?.metrics?.value
    };
    return {
      card_name: item?.card_name,
      metrics: metricsRecord,
      icon: iconList[index % iconList?.length],
    };
  });

  return <LmsCommonSummary data={mappedData} />;
};

export default CoursesSummaryWrapper;
