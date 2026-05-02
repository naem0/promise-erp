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
import SectionLoadingSkeleton from "../common/SectionLoadingSkeleton";
import {
  EarningsChartApiResponse,
  EarningsChartItem,
  getStudentEarningBdtChart,
} from "@/apiServices/studentDashboardService";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";

const EarningsChartBDT = () => {
  const [earningsDataBDT, setEarningsDataBDT] = useState<EarningsChartApiResponse | null>( null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const token = session?.accessToken;

  useEffect(() => {
     if (!token) return;
    startTransition(async () => {
      try {
        const response = await getStudentEarningBdtChart(token);
        if (!response?.success) {
          console.error(response?.message);
        } else {
          setEarningsDataBDT(response);
          // setEarningsDataBDT(response?.data?.chart_data || []);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error fetching BDT earnings data:", error.message);
        } else {
          console.error("Unknown error fetching USD earnings data");
        }
      }
    });
  }, [token]);

  if (isPending) return <SectionLoadingSkeleton />;

  const data = earningsDataBDT?.data?.chart_data || [];

  if (!earningsDataBDT || !earningsDataBDT?.data ){
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Earnings Overview (BDT)
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBDT" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
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
                tickFormatter={(value) => `৳ ${value}`}
                dx={-1}
              />

              {/* Tooltip Added */}
              <Tooltip
                formatter={(value: number) => `৳ ${value}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  border: "1px solid var(--primary)",
                }}
                itemStyle={{ color: "var(--primary)" }}
              />

              <Area
                type="monotone"
                dataKey="earning"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#colorBDT)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChartBDT;
