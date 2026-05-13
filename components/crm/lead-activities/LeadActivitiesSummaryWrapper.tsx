import { getLeadsActivity } from "@/apiServices/crmLeadsActivityService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Zap, GraduationCap, MessageSquare, TrendingUp, ArrowUp } from "lucide-react";
 
export default async function LeadsActivitySummaryWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams || {};
  const params = {
    page: 1,
    per_page: 15,
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined,
    status: typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    user_id: typeof resolvedSearchParams.user_id === "string" ? resolvedSearchParams.user_id : undefined,
  };
 
  let results;
  try {
    results = await getLeadsActivity(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }
 
  if (!results || !results.success || !results.data || !results.data.stats) {
    return null;
  }
 
  const { stats } = results.data;
 
  const statCards = [
    {
      title: "Total Leads",
      value: stats.total_leads,
      label: "Leads",
      icon: Zap,
      gradient: "from-[#00B686] to-[#00D19D]",
    },
    {
      title: "New Enrollments",
      value: stats.new_enrollments,
      label: "Students",
      icon: GraduationCap,
      gradient: "from-[#2D76E5] to-[#4A90E2]",
    },
    {
      title: "Lost Leads",
      value: stats.lost_leads,
      label: "Lost",
      icon: MessageSquare,
      gradient: "from-[#E64A6E] to-[#F06292]",
    },
    {
      title: "Conversion Rate",
      value: stats.conversion_rate,
      label: "",
      icon: TrendingUp,
      gradient: "from-[#E67E00] to-[#FFA726]",
    },
  ];
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`text-white rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden bg-linear-to-br ${card.gradient}`}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-lg">{card.title}</h3>
            </div>
 
            {/* Content & Large Icon */}
            <div className="flex items-end justify-between mt-4 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{card.value}</span>
                {card.label && (
                  <span className="text-xl font-medium opacity-90">{card.label}</span>
                )}
              </div>
            </div>
 
            {/* Faint Background Icon */}
            <Icon
              className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 z-0"
              strokeWidth={1.5}
            />
 
            {/* Footer Pill - Static for now as per image if data not available */}
            <div className="mt-6 relative z-10">
              <div className="flex items-center gap-1 text-sm bg-white/20 w-fit px-3 py-1 rounded-md">
                <ArrowUp className="w-4 h-4" />
                <span>23.1% From Last Week</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
