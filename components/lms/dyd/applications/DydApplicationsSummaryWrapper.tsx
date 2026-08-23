import { getDydApplicationsOverview, DydOverviewResponse } from "@/apiServices/dydApplicationService";
import ErrorComponent from "@/components/common/ErrorComponent";
import LmsCommonSummary from "@/components/lms/LmsCommonSummary";
import { Users, FileText, Bell, CheckCircle2, Award } from "lucide-react";

const DydApplicationsSummaryWrapper = async () => {
  let stats: DydOverviewResponse | null = null;

  try {
    stats = await getDydApplicationsOverview();
  } catch (error: unknown) {
    if (
      typeof error === "object" && error !== null && "digest" in error
    ) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch DYD application overview";

    return (
      <div className="py-10">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats || !stats?.data) {
    return null;
  }

  const iconList = [Users, FileText, Bell, CheckCircle2, Award];
  const mappedData = stats?.data?.map((item, index) => ({
    card_name: item?.card_name,
    metrics: {
      value: item?.metrics?.value ?? 0,
      ...(item?.label ? { status: item?.label } : {}),
    },
    icon: iconList[index % iconList.length],
  }));

  return <LmsCommonSummary data={mappedData} />;
};

export default DydApplicationsSummaryWrapper;
