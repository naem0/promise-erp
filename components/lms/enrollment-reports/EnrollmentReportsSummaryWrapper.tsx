import { getCourseSalesSummary, CourseSalesSummaryApiResponse } from "@/apiServices/enrollmentReportService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary, { LmsDashboardStat } from "../LmsCommonSummary";
import { Users, UserCheck, UserCog, CalendarDays, Briefcase, UserPlus } from "lucide-react";

const EnrollmentReportsSummaryWrapper = async () => {
  let stats: CourseSalesSummaryApiResponse | null = null;

  try {
    stats = await getCourseSalesSummary();
  } catch (error: unknown) {
    if (
      typeof error === "object" && error !== null && "digest" in error
    ) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Failed to fetch course sales summary";

    return (
      <div className="py-10">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats || !stats?.data) {
    return null;
  }

  const iconList = [Users, UserCheck, UserCog, CalendarDays, Briefcase, UserPlus];
  const mappedData: LmsDashboardStat[] = (stats?.data?.summary || []).map((item, index) => {
    const cardName = item?.title || (item?.key ? item.key.replace(/_/g, " ") : "");

    return {
      card_name: cardName,
      metrics: {
        value: item?.value,
        ...(item?.course_name && { course_name: item?.course_name }),
        ...(item?.growth && { growth: item?.growth }),
      },
      icon: iconList[index % iconList.length],
    };
  });

  return <LmsCommonSummary data={mappedData} />;
};

export default EnrollmentReportsSummaryWrapper;