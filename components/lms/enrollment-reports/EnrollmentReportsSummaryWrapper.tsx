
import {
  getCourseSalesSummary,
  CourseSalesSummaryApiResponse,
  CourseSalesSummaryItem,
} from "@/apiServices/enrollmentReportService";
import ErrorComponent from "@/components/common/ErrorComponent";
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  Boxes,
  CreditCard,
  GraduationCap,
  Layers3,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

const gradients = [
  "from-[#3477DB] to-[#4B8CF0]",
  "from-[#8D49E6] to-[#A864FF]",
  "from-[#18BDE6] to-[#34D4FF]",
  "from-[#E34771] to-[#FF6B8F]",
  "from-[#08B98B] to-[#10D9A3]",
  "from-[#5A00D6] to-[#7E31FF]",
  "from-[#EE8600] to-[#FFAA33]",
];

const iconMap: Record<string, React.ElementType> = {
  "Total Received": Banknote,
  "Advance Received": Wallet,
  "Total Due": CreditCard,
  "Running Batches": Layers3,
  "Total Enrollments": Users,
  "New Students This Week": UserPlus,
  "Collection Growth": TrendingUp,
  "Due Collection": Boxes,
  "Pending Payment": Wallet,
  "Cancelled Enrollments": XCircle,
  "Most Selling Course": Star,
};

export default async function EnrollmentReportsSummaryWrapper() {
  let summaryResponse: CourseSalesSummaryApiResponse | null = null;

  try {
    summaryResponse = await getCourseSalesSummary();
  } catch (error: unknown) {
    return (
      <div className="py-8 md:py-12">
        <ErrorComponent
          message={
            error instanceof Error
              ? error.message
              : "An unknown error occurred"
          }
        />
      </div>
    );
  }

  if (!summaryResponse?.success || !summaryResponse?.data) {
    return null;
  }

  const summaryData = summaryResponse.data.summary;

  const formatValue = (item: CourseSalesSummaryItem) => {
    const title = item.title || "Most Selling Course";

    if (title === "Collection Growth" || title === "Due Collection") {
      return `${item.value}%`;
    }

    if (
      [
        "Running Batches",
        "Total Enrollments",
        "New Students This Week",
        "Cancelled Enrollments",
      ].includes(title)
    ) {
      return `${item.value.toLocaleString()} Students`;
    }

    if (title === "Most Selling Course") {
      return `${String(item.value).padStart(2, "0")} Course`;
    }

    return `৳ ${item.value.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {summaryData.map((item: CourseSalesSummaryItem, index: number) => {
        const title =
          item.key === "most_selling_course"
            ? "Most Selling Course"
            : item.title || "";

        const Icon = iconMap[title] || TrendingUp;

        const growth = item.growth || "";
        const isPositive = growth.startsWith("+");
        const isNegative = growth.startsWith("-");

        const gradient = gradients[index % gradients.length];

        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${gradient} p-5 text-white shadow-sm`}
          >
            {/* Top */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-medium">{title}</h3>
            </div>

            {/* Middle */}
            <div className="relative z-10 mt-6">
              <h2 className="text-3xl font-bold">
                {formatValue(item)}
              </h2>

              {item.course_name && (
                <p className="mt-1 text-sm text-white/80">
                  {item.course_name}
                </p>
              )}
            </div>

            {/* Background Icon */}
            <Icon
              className="absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2 opacity-15"
              strokeWidth={1.5}
            />

            {/* Footer */}
            <div className="relative z-10 mt-6">
              <div className="flex w-fit items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs md:text-sm">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 md:h-4 md:w-4" />
                ) : isNegative ? (
                  <ArrowDown className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <div className="w-3 md:w-4" />
                )}

                <span>
                  {growth.replace(/^[+-]/, "") || "0% From Last Week"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}