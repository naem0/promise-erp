import { getLeadActivitiesSummary, LeadActivitiesSummaryResponse } from "@/apiServices/crmLeadActivitiesService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Zap, Users, Network, AlertCircle, Star } from "lucide-react";

export default async function LeadsActivitySummaryWrapper() {

  let results: LeadActivitiesSummaryResponse | null;
  try {
    results = await getLeadActivitiesSummary();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results?.success || !results?.data || !results?.data?.stats) {
    return null;
  }

  const { stats } = results.data;

  const statCards = [
    {
      id: "leads",
      title: "Leads",
      icon: Zap,
      gradient: "from-[#3B82F6] to-[#1D4ED8]",
      stats: [
        { label: "Total", value: stats.total_leads ?? 0 },
        { label: "Today", value: stats.today_leads ?? 0 },
      ],
    },
    {
      id: "enrolment",
      title: "Enrolment",
      icon: Users,
      gradient: "from-[#8B5CF6] to-[#6D28D9]",
      stats: [
        { label: "Total", value: stats.total_enrollments ?? 0 },
        { label: "Today", value: stats.today_enrollments ?? 0 },
      ],
    },
    {
      id: "follow_up",
      title: "Follow Up & Interested",
      icon: Network,
      gradient: "from-[#EA580C] to-[#C2410C]",
      stats: [
        { label: "Total", value: stats.total_follow_up ?? 0 },
        { label: "Today", value: stats.today_follow_up ?? 0 },
      ],
    },
    {
      id: "lost_leads",
      title: "Lost Leads",
      icon: AlertCircle,
      gradient: "from-[#4C1D95] to-[#1E1B4B]",
      stats: [
        { label: "Total", value: stats.total_lost ?? 0 },
        { label: "Today", value: (stats.today_lost ?? 0) - (stats.today_lost ?? 0) },
      ],
    },
    {
      id: "status",
      title: "Status",
      icon: Star,
      gradient: "from-[#06B6D4] to-[#0891B2]",
      stats: [
        { label: "Conversion", value: stats.conversion_rate ?? "0%" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-6">
      {statCards?.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`text-white rounded-2xl p-4 flex flex-col h-full shadow-md relative overflow-hidden bg-gradient-to-br ${card.gradient} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-base tracking-wide">{card.title}</h3>
            </div>

            {/* Content / Stats */}
            <div className="flex gap-2 mt-auto relative z-10">
              {card.stats.map((stat, sIndex) => (
                <div key={sIndex} className="flex flex-col border border-white/20 rounded-lg py-1 px-3 bg-white/10 flex-1">
                  <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider mb-1">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Background Icon */}
            <Icon
              className="absolute -right-4 -bottom-4 w-24 h-24 opacity-15 stroke-[1.5] text-white z-0 pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out"
              strokeWidth={1.5}
            />
          </div>
        );
      })}
    </div>
  );
}
