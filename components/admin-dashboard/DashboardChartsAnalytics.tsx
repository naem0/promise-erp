"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSummaryStat } from "@/apiServices/adminDashboardService";

// ─── Constants ────────────────────────────────────────────────────────────────
const SERIES_COLORS = ["#3B9EEB", "#F97316", "#10B981", "#8B5CF6"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert card_name to a valid CSS variable key (no spaces). */
function toKey(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_");
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

/**
 * Merge all card_data arrays into a single flat array for recharts.
 * Each unique title becomes one row; each card becomes a bar key.
 * Percentage-only items are excluded from the x-axis.
 */
function buildChartData(series: DashboardSummaryStat[]) {
  const titleSet = new Set<string>();
  series.forEach((stat) => {
    stat.card_data
      .filter((d) => !d.title.toLowerCase().includes("percentage"))
      .forEach((d) => titleSet.add(d.title));
  });

  return Array.from(titleSet).map((title) => {
    const row: Record<string, string | number> = { title };
    series.forEach((stat) => {
      const match = stat.card_data.find(
        (d) => d.title === title && !d.title.toLowerCase().includes("percentage")
      );
      row[toKey(stat.card_name)] = match?.value ?? 0;
    });
    return row;
  });
}

/** Build shadcn ChartConfig from the series with data. */
function buildChartConfig(series: DashboardSummaryStat[]): ChartConfig {
  const config: ChartConfig = {};
  series.forEach((stat, i) => {
    config[toKey(stat.card_name)] = {
      label: stat.card_name,
      color: SERIES_COLORS[i % SERIES_COLORS.length],
    };
  });
  return config;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface DashboardChartsAnalyticsProps {
  chartsAnalytics: DashboardSummaryStat[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardChartsAnalytics({
  chartsAnalytics,
}: DashboardChartsAnalyticsProps) {
  if (!chartsAnalytics?.length) return null;

  // Only include cards that actually have data
  const seriesWithData = chartsAnalytics.filter((s) => s.card_data.length > 0);
  if (!seriesWithData.length) return null;

  const chartData = buildChartData(seriesWithData);
  const chartConfig = buildChartConfig(seriesWithData);

  return (
    <Card className="rounded-2xl shadow-md border bg-white my-5">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800">
          Charts Analytics
        </CardTitle>
        <CardDescription>
          Enrollment trends, course ratio &amp; sales progress — all in one view
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart data={chartData} barGap={4} barCategoryGap="28%">
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f3f8"
            />
            <XAxis
              dataKey="title"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#8c93a3" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#8c93a3" }}
              tickFormatter={formatYAxis}
              width={45}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            {seriesWithData.map((stat) => (
              <Bar
                key={stat.card_name}
                dataKey={toKey(stat.card_name)}
                fill={`var(--color-${toKey(stat.card_name)})`}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
