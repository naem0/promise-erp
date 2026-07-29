import {
  getCRMLeadReportsSummaryCards,
  CRMLeadReportsSummaryCard,
} from "@/apiServices/crmLeadReportsService";
import {
  ArrowDown,
  ArrowUp,
  LucideIcon,
  Phone,
  Star,
  UserPlus,
  Zap,
} from "lucide-react";

export default async function CRMLeadReportsSummaryWrapper() {
  let cards: CRMLeadReportsSummaryCard[] = [];

  try {
    const results = await getCRMLeadReportsSummaryCards();
    if (results?.success) {
      cards = results?.data || [];
    }
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error) {
      console.error("Error fetching CRM report summary cards:", error.message);
    }
  }

  if (!cards.length) {
    return null;
  }

  const iconMap: Record<string, LucideIcon> = {
    Zap: Zap,
    UserPlus: UserPlus,
    Phone: Phone,
    Star: Star,
  };

  const colorMap: Record<string, string> = {
    blue: "#2D76E5",
    purple: "#9148EF",
    cyan: "#00B8E6",
    red: "#E64A6E",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {cards.map((card, index) => {
        const bg = colorMap[card.color] || "#2D76E5";
        const Icon = iconMap[card.icon] || Zap;

        return (
          <div
            key={index}
            className="text-white rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden"
            style={{ backgroundColor: bg }}
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
                <span className="text-xl font-medium opacity-90">
                  {card.unit}
                </span>
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
                {card.is_up ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{card.comparison}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
