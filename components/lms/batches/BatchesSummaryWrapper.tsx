import { getBatchStats, BatchStatsResponse } from "@/apiServices/batchService";
import ErrorComponent from "../../common/ErrorComponent";
import LmsCommonSummary from "../LmsCommonSummary";
import { PlayCircle, Clock, Laptop, School } from "lucide-react";

const BatchesSummaryWrapper = async () => {
  let stats: BatchStatsResponse | null = null;

  try {
    stats = await getBatchStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching batch stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch batch stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  const iconList = [PlayCircle, Clock, Laptop, School];
  const mappedData = stats.data.map((item, index) => ({
    ...item,
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default BatchesSummaryWrapper;
