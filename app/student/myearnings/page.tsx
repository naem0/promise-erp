import dynamic from "next/dynamic";
import SectionLoadingSkeleton from "@/components/common/SectionLoadingSkeleton";
const EarningsChartBDT = dynamic(
  () => import("@/components/student-dashboard/EarningsChartBDT")
);
const EarningsChartUSD = dynamic(
  () => import("@/components/student-dashboard/EarningsChartUSD")
);
import EarningStateGrids from "@/components/student-dashboard/EarningStateGrids";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const MyEarningsPage = () => {
  return (
    <section className="py-8 lg:py-12 px-4">
      <div className="flex items-center justify-between gap-2 px-4 mb-5">
        <h1 className="text-2xl font-bold text-secondary">My Earnings</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href="/student/myearnings/all-list"
              className="flex items-center gap-2"
            >
              <Plus />
              View All Earnings
            </Link>
          </Button>
          <Button asChild>
            <Link
              href="/student/myearnings/add"
              className="flex items-center gap-2"
            >
              <Plus />
              Add New Earning
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<SectionLoadingSkeleton />}>
        <EarningStateGrids />
      </Suspense>
      <div className="px-4 mb-5">
        <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
          <EarningsChartUSD />
        </Suspense>
      </div>
      <div className="px-4">
        <Suspense fallback={<div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />}>
          <EarningsChartBDT />
        </Suspense>
      </div>
    </section>
  );
};

export default MyEarningsPage;
