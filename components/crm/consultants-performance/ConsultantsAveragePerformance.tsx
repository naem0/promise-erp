"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A radial chart with stacked sections";

const chartConfig = {
  performance: {
    label: "Performance",
    color: "#16a34a",
  },
  remainder: {
    label: "Remainder",
    color: "#e2e8f0",
  },
} satisfies ChartConfig;

interface ConsultantsAveragePerformanceProps {
  average_performance: number;
  period?: string;
}

export function ConsultantsAveragePerformance({ average_performance, period = "this_week" }: ConsultantsAveragePerformanceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const chartData = [
    {
      month: "Current",
      remainder: 100 - average_performance,
      performance: average_performance,
    },
  ];

  return (
    <Card className="flex flex-col h-full shadow-none border rounded-xl gap-4">
      <CardHeader className="flex flex-row items-start justify-between pb-0 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-sm font-medium text-slate-700">Average Performance</CardTitle>
          <CardDescription>Overall performance rate</CardDescription>
        </div>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="h-8 w-28 text-xs bg-white">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-2/1 w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={110}
            cx="50%"
            cy="100%"
          >
            <RadialBar
              dataKey="performance"
              fill="var(--color-performance)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="remainder"
              fill="var(--color-remainder)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 30}
                          className="fill-foreground text-xl font-bold"
                        >
                          {average_performance}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          className="fill-muted-foreground text-xs"
                        >
                          Performance
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* 
      // Optional Footer matching the stacked example
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current performance metrics
        </div>
      </CardFooter> 
      */}
    </Card>
  );
}
