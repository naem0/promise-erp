import { getCourseSalesSummary, CourseSalesSummaryApiResponse } from "@/apiServices/enrollmentReportService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { 
  ArrowDown, 
  ArrowUp, 
  Banknote, 
  CreditCard, 
  GraduationCap, 
  Layers, 
  MessageCircle, 
  PieChart, 
  TrendingUp, 
  Zap 
} from "lucide-react";

export default async function EnrollmentReportsSummaryWrapper() {
  let summaryResponse: CourseSalesSummaryApiResponse | null = null;
  
  try {
    summaryResponse = await getCourseSalesSummary();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={error.message || "An unknown error occurred"}
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred" />
        </div>
      );
    }
  }

  if (!summaryResponse || !summaryResponse.success || !summaryResponse.data) {
    return null;
  }

  const summaryData = summaryResponse.data.summary;

  const cardsInfo = [
    {
      title: "Total Received",
      stat: summaryData.total_received,
      prefix: "৳ ",
      bg: "#00B686", // green
      SmallIcon: Banknote,
      LargeIcon: Zap,
    },
    {
      title: "Advance",
      stat: summaryData.advance,
      prefix: "৳ ",
      bg: "#E67E00", // orange
      SmallIcon: PieChart,
      LargeIcon: TrendingUp,
    },
    {
      title: "Total Due",
      stat: summaryData.total_due,
      prefix: "৳ ",
      bg: "#2D76E5", // blue
      SmallIcon: CreditCard,
      LargeIcon: GraduationCap,
    },
    {
      title: "Running Batch",
      stat: summaryData.running_batch,
      prefix: "",
      bg: "#E64A6E", // pink
      SmallIcon: Layers,
      LargeIcon: MessageCircle,
      padZero: true,
    },
  ];

  const formatValue = (val: number, prefix: string, padZero: boolean) => {
    let formatted = val.toLocaleString();
    if (padZero && val < 10 && val > 0) {
        formatted = `0${val}`;
    } else if (padZero && val === 0) {
        formatted = "00";
    }
    return `${prefix}${formatted}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {cardsInfo.map((card, index) => {
        const { title, stat, prefix, bg, SmallIcon, LargeIcon, padZero } = card;
        
        const growth = stat?.growth || "";
        const isPositive = growth.startsWith("+");
        const isNegative = growth.startsWith("-");
        
        const percentageText = growth.replace(/^[+-]/, '').trim() || "0% From Last Week";

        return (
          <div 
            key={index} 
            className="text-white rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden"
            style={{ backgroundColor: bg }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg">
                <SmallIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-lg">{title}</h3>
            </div>

            {/* Content & Large Icon */}
            <div className="flex items-end justify-between mt-4 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold">
                  {formatValue(stat?.value || 0, prefix, !!padZero)}
                </span>
              </div>
            </div>
            
            {/* Faint Background Icon */}
            <LargeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 z-0" strokeWidth={1.5} />

            {/* Footer Pill */}
            <div className="mt-6 relative z-10">
              <div className="flex items-center gap-1 text-xs md:text-sm bg-white/20 w-fit px-3 py-1 rounded-full md:rounded-md">
                {isPositive ? (
                  <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
                ) : isNegative ? (
                  <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
                ) : <ArrowUp className="w-3 h-3 md:w-4 md:h-4 opacity-0" />}
                <span>{percentageText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
