import { Warehouse, School, BookCopy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BranchStatisticsResponse,
  getPublicBranchStatistics,
} from "@/apiServices/branchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const BranchState = async () => {
  let statistics: BranchStatisticsResponse | null = null;

  try {
    statistics = await getPublicBranchStatistics();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error) {
      console.error("Failed to fetch branch statistics:", error.message);
      return (
        <div className="flex items-center justify-center pt-8 lg:pt-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      console.error("Failed to fetch branch statistics:", error);
      return (
        <div className="flex items-center justify-center pt-8 lg:pt-12">
          <ErrorComponent message="An unexpected error occurred while fetching branch statistics." />
        </div>
      );
    }
  }

  const data = statistics?.data;

  if (!data || !statistics) {
    return (
      <div className="flex items-center justify-center pt-8 lg:pt-12">
        <NotFoundComponent
          message={statistics?.message || "No branch statistics found"}
        />
      </div>
    );
  }


  const statsItems = [
    {
      title: "Total Divisions",
      count: data.total_divisions,
      icon: <Warehouse className="h-6 w-6 text-primary" />,
    },
    {
      title: "Total Districts",
      count: data.total_districts,
      icon: <School className="h-6 w-6 text-primary" />,
    },
    {
      title: "Total Branches",
      count: data.total_branches,
      icon: <BookCopy className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section className="pt-8 md:pt-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 w-full">
          {statsItems?.map((item, index) => (
            <Card
              key={index}
              className="py-3 gap-2 bg-linear-to-r from-[#0B5B28] via-[#1C833E] to-[#009F41] border-none shadow-lg text-white"
            >
              <CardContent className="p-0 flex flex-col items-center text-center">
                <div className="bg-white p-2 rounded-lg mb-2 shadow-xl border border-secondary/50">
                  {item.icon}
                </div>

                <h3 className="font-bold text-2xl">{item.count}</h3>

                <p className="text-sm opacity-90">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchState;
