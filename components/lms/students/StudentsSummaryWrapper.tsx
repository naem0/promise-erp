import { getStudents } from "@/apiServices/studentService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { ArrowUp, Sparkles, ShieldCheck, Scale, CircleDollarSign } from "lucide-react";

export default async function StudentsSummaryWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;

  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    is_govt:
      typeof resolvedSearchParams.is_govt === "string"
        ? resolvedSearchParams.is_govt
        : undefined,
    is_blocked:
      typeof resolvedSearchParams.is_blocked === "string"
        ? resolvedSearchParams.is_blocked
        : undefined,
    division_id:
      typeof resolvedSearchParams.division_id === "string"
        ? resolvedSearchParams.division_id
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    course_id:
      typeof resolvedSearchParams.course_id === "string"
        ? resolvedSearchParams.course_id
        : undefined,
  };

  let summaryResponse;
  try {
    summaryResponse = await getStudents(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={error.message || "An unknown error occurred"} />
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

  const {
    total_students = 0,
    total_running_students = 0,
    total_govt_students = 0,
    total_paid_students = 0,
  } = summaryResponse?.data;

  const cardsInfo = [
    {
      title: "Total Students",
      value: total_students,
      bg: "#00B686", // green
      SmallIcon: Sparkles,
      LargeIcon: Sparkles,
    },
    {
      title: "Running Students",
      value: total_running_students,
      bg: "#2D76E5", // blue
      SmallIcon: ShieldCheck,
      LargeIcon: ShieldCheck,
    },
    {
      title: "Govt. Students",
      value: total_govt_students,
      bg: "#9148EF", // purple
      SmallIcon: Scale,
      LargeIcon: Scale,
    },
    {
      title: "Paid Students",
      value: total_paid_students,
      bg: "#E67E00", // orange
      SmallIcon: CircleDollarSign,
      LargeIcon: CircleDollarSign,
    },
  ];

  const formatValue = (val: number) => {
    return val.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {cardsInfo.map((card) => {
        const { title, value, bg, SmallIcon, LargeIcon } = card;

        return (
          <div
            key={title}
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

            {/* Content */}
            <div className="flex items-baseline gap-2 mt-4 relative z-10">
              <span className="text-2xl xxl:text-4xl lg:text-3xl font-bold">
                {formatValue(value)}
              </span>
              <span className="text-lg font-medium">Students</span>
            </div>

            {/* Faint Background Icon */}
            <LargeIcon
              className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 z-0"
              strokeWidth={1.5}
            />

            {/* Footer Pill */}
            <div className="mt-6 relative z-10">
              <div className="flex items-center gap-1 text-xs md:text-sm bg-white/20 w-fit px-3 py-1 rounded-full md:rounded-md">
                <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
                <span>23.1% From Last Week</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
