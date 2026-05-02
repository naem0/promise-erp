"use client";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EarningsChartApiResponse,
  EarningsChartData,
  EarningsChartItem,
  getStudentEarningUsdChart,
} from "@/apiServices/studentDashboardService";
import { useEffect, useState, useTransition } from "react";
import SectionLoadingSkeleton from "../common/SectionLoadingSkeleton";
import { useSession } from "next-auth/react";

const EarningsChartUSD = () => {
  const [earningsDataUSD, setEarningsDataUSD] = useState<EarningsChartApiResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const { data: session } = useSession();
  const token = session?.accessToken;

  useEffect(() => {
    if (!token) return;
    startTransition(async () => {
      try {
        const response = await getStudentEarningUsdChart(token);
        if (!response?.success) {
          console.error(response?.message);
        } else {
          setEarningsDataUSD(response);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error fetching USD earnings data:", error.message);
        } else {
          console.error("Unknown error fetching USD earnings data");
        }
      }
    });
  }, [token]);

  if (isPending) return <SectionLoadingSkeleton />;

  const earningsData = earningsDataUSD?.data?.chart_data || [];
  if (!earningsDataUSD || !earningsDataUSD?.success || !earningsDataUSD?.data || earningsData?.length === 0) {
    return null;
  }

  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Earnings Overview(USD)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={earningsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUSD" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--secondary)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--secondary)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--black)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--black)", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              {/* Tooltip Added */}
              <Tooltip
                formatter={(value: number) => `$ ${value}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  border: "1px solid var(--secondary)",
                }}
                itemStyle={{ color: "var(--secondary)" }}
              />
              <Area
                type="monotone"
                dataKey="earning"
                stroke="var(--secondary)"
                strokeWidth={2.5}
                fill="url(#colorUSD)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChartUSD;
