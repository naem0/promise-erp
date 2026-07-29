import {
  getStudentEarningState,
  StEarningStateResponse,
} from "@/apiServices/studentDashboardService";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const EarningStateGrids = async () => {
  let earningStateData: StEarningStateResponse | null = null;
  try {
    earningStateData = await getStudentEarningState();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error) {
      console.error("Error fetching BDT earnings data:", error.message);
    } else {
      console.error("Error fetching BDT earnings data:", error);
    }
  }
  
  const cards = earningStateData?.data?.earning_cards;
  if (!earningStateData || !earningStateData?.data || !cards ) {
    return null;
  }


  return (
    <div className="px-4 py-4 lg:py-6 relative">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* TOTAL USD EARNINGS */}
        <Card className="border-none bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                  <DollarSign className="h-4 w-4" />
                  Total USD Earnings
                </div>

                <div className="text-2xl font-bold">
                  $ {cards?.total_usd_earning ?? "--"}
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  {cards?.usd_earning_change === "increase" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {cards?.usd_earning_percentage ?? "--"}%
                </div>
              </div>

              {cards?.usd_earning_change === "increase" ? (
                <TrendingUp className="h-16 w-16 opacity-20" />
              ) : (
                <TrendingDown className="h-16 w-16 opacity-20" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* TOTAL BDT EARNINGS */}
        <Card className="border-none bg-linear-to-br from-indigo-900 to-indigo-800 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                  <Wallet className="h-4 w-4" />
                  Total BDT Earnings
                </div>

                <div className="text-2xl font-bold">
                  ৳{cards?.total_bdt_earning ?? "--"}
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  {cards?.bdt_earning_change === "increase" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {cards?.bdt_earning_percentage ?? "--"}%
                </div>
              </div>

              <Wallet className="h-16 w-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* THIS MONTH EARNINGS */}
        <Card className="border-none bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                  <TrendingUp className="h-4 w-4" />
                  This Month
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-bold">
                    $ {cards?.this_month_earning_usd ?? "--"}
                  </div>

                  <div className="text-2xl font-bold ">
                    ৳ {cards?.this_month_earning_bdt ?? "--"}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {cards?.earning_percentage ?? "--"} %
                </div>
              </div>

              <TrendingUp className="h-16 w-16 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningStateGrids;
