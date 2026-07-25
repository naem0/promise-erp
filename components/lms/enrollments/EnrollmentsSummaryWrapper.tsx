import { getEnrollmentStats, EnrollmentStatsResponse } from "@/apiServices/enrollmentService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { Users, Clock, Banknote, CreditCard } from "lucide-react";

const EnrollmentsSummaryWrapper = async () => {
  let stats: EnrollmentStatsResponse | null = null;

  try {
    stats = await getEnrollmentStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching enrollment stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch enrollment stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  const iconList = [Users, Clock, Banknote, CreditCard];
  const mappedData = stats.data.map((item, index) => ({
    ...item,
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default EnrollmentsSummaryWrapper;
