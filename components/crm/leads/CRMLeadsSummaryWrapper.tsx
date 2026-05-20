import { getCRMLeads } from "@/apiServices/crmLeadsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Zap, GraduationCap, MessageSquare, TrendingUp, ArrowUp, PhoneCall, ArrowDown } from "lucide-react";
 
export default async function CRMLeadsSummaryWrapper({
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
    results = await getCRMLeads(params);
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
 
  const { stats, growth } = results.data;
 
  const statCards = [
    {
      id: "total_leads",
      title: "Total Leads",
      value: stats.total_leads,
      label: "Leads",
      icon: Zap,
      gradient: "from-[#00B686] to-[#00D19D]",
    },
    {
      id: "new_enrollments",
      title: "New Enrollments",
      value: stats.new_enrollments,
      label: "Students",
      icon: GraduationCap,
      gradient: "from-[#2D76E5] to-[#4A90E2]",
    },
    {
      id: "lost_leads",
      title: "Lost Leads",
      value: stats.lost_leads,
      label: "Lost",
      icon: MessageSquare,
      gradient: "from-[#E64A6E] to-[#F06292]",
    },
    {
      id: "conversion_rate",
      title: "Conversion Rate",
      value: stats.conversion_rate,
      label: "",
      icon: TrendingUp,
      gradient: "from-[#E67E00] to-[#FFA726]",
    },
    {
      id: "old_leads",
      title: "Old Leads",
      value: stats.old_leads ?? 0,
      label: "Students",
      icon: Zap,
      gradient: "from-[#2D76E5] to-[#4A90E2]",
    },
    {
      id: "to_day_leads",
      title: "Today Leads",
      value: stats.to_day_leads ?? 0,
      label: "Students",
      icon: Zap,
      gradient: "from-[#9333EA] to-[#C084FC]",
    },
    {
      id: "total_flowup",
      title: "Total Follow-Up",
      value: stats.total_flowup ?? 0,
      label: "Students",
      icon: PhoneCall,
      gradient: "from-[#00C6FF] to-[#0072FF]",
    },
    {
      id: "to_day_flowup",
      title: "Today Follow-Up",
      value: stats.to_day_flowup ?? 0,
      label: "Students",
      icon: PhoneCall,
      gradient: "from-[#059669] to-[#34D399]",
    },
  ];
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
      {statCards?.map((card, index) => {
        const Icon = card.icon;
        const growthValue = growth && growth[card.id] !== undefined ? growth[card.id] : 0;
        
        return (
          <div
            key={index}
            className={`text-white rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden bg-gradient-to-br ${card.gradient}`}
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

            {/* Footer Pill */}
            <div className="mt-6 relative z-10">
              <div className="flex items-center gap-1 text-sm bg-white/20 w-fit px-3 py-1 rounded-md">
                {growthValue < 0 ? (
                  <ArrowDown className="w-4 h-4 text-red-200" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
                <span>{Math.abs(growthValue)}% From Last Week</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
