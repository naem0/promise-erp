import {
  getConsultantAveragePerformance,
  getConsultantPerformanceSummary,
} from "@/apiServices/crmConsultantPerformanceService";
import { Headphones, TrendingUp } from "lucide-react";
import Image from "next/image";
import { ConsultantsAveragePerformance } from "./ConsultantsAveragePerformance";
import ErrorComponent from "@/components/common/ErrorComponent";

const ConsultantsPerformanceSummaryWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const branch_id = typeof resolvedSearchParams.branch_id === "string" ? resolvedSearchParams.branch_id : undefined;
  const period = typeof resolvedSearchParams.period === "string" ? resolvedSearchParams.period : "today";

  const params = { branch_id, period };

  let summaryData;
  let summaryRes;
  let averageData;
  let averageRes;

  try {
    summaryRes = await getConsultantPerformanceSummary(params);
    summaryData = summaryRes?.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching performance summary:", error.message);
      return (
        <div className="py-8">
          <ErrorComponent message={`Error fetching performance summary: ${error.message}`} />
        </div>
      ); // Return null if summary fetch fails, since it's essential for the component
    } else {
      console.error("Unknown error fetching performance summary");
      return (
        <div className="py-8">
          <ErrorComponent message={`Error fetching performance summary: ${error instanceof Error ? error.message : "Unknown error"}`} />
        </div>
      );
    }

  }

  try {
    averageRes = await getConsultantAveragePerformance(params);
    averageData = averageRes?.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching average performance:", error.message);
      return (
        <div className="py-8">
          <ErrorComponent message={`Error fetching average performance: ${error.message}`} />
        </div>
      );
    } else {
      console.error("Unknown error fetching average performance");
      return (
        <div className="py-8">
          <ErrorComponent message="Unknown error fetching average performance" />
        </div>
      );
    }
  }

  // if both fail
  if (!summaryRes || !averageRes || !summaryData || !averageData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
      {/* Total Consultants Card */}
      <div className="bg-[#4285F4] text-white rounded-xl p-5 flex flex-col h-full shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium text-lg">Total Consultants</h3>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{summaryData.total_consultants}</span>
            <span className="text-2xl font-medium opacity-90">Consultant</span>
          </div>
          <Headphones className="w-12 h-12 opacity-20" />
        </div>
        <div className="mt-4 flex items-center gap-1 text-sm bg-white/20 w-fit px-2 py-1 rounded-md">
          <TrendingUp className="w-4 h-4" />
          <span>Update via filters</span>
        </div>
      </div>

      {/* Active Consultants Card */}
      <div className="bg-[#A142F4] text-white rounded-xl p-5 flex flex-col h-full shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium text-lg">Active Consultants</h3>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{summaryData.active_consultants}</span>
            <span className="text-2xl font-medium opacity-90">Consultant</span>
          </div>
          <Headphones className="w-12 h-12 opacity-20" />
        </div>
        <div className="mt-5 flex items-center gap-1 text-sm bg-white/20 w-fit px-2 py-1 rounded-md">
          <TrendingUp className="w-4 h-4" />
          <span>Update via filters</span>
        </div>
      </div>

      {/* Top Performers Card */}
      <div className="bg-white border rounded-xl p-5 h-full shadow-sm flex flex-col">
        <h3 className="text-center font-semibold text-[#2b2b5f] text-lg mb-4">Top Performers</h3>
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[170px]">
          {summaryData.top_performers && summaryData.top_performers.length > 0 ? (
            summaryData.top_performers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={performer.profile_image || "/images/profile_avatar.png"}
                    alt={performer.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{performer.name}</p>
                    <p className="text-[10px] text-slate-500 max-w-[120px] leading-tight mt-0.5">
                      {performer.designation},<br />
                      {performer.department}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-[#2b2b5f] text-lg">
                  {performer.formatted_score}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground">No top performers found.</p>
          )}
        </div>
      </div>

      {/* Average Performance Card */}
      <div className="h-full">
        <ConsultantsAveragePerformance
          average_performance={averageData.average_performance}
          period={period}
        />
      </div>
    </div>
  );
};

export default ConsultantsPerformanceSummaryWrapper;
