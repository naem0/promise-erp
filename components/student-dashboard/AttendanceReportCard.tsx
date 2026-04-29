"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StClassAttendance } from "@/apiServices/studentDashboardService";

interface AttendanceReportCardProps {
  data: StClassAttendance[];
}

const chartConfig = [
  {
    key: "classes_attended",
    label: "Classes Attended",
    color: "#3b82f6",
    totalKey: "total_classes",
  },
  {
    key: "classes_completed",
    label: "Classes Completed",
    color: " #22c55e",
    totalKey: "total_classes",
  },
];

const AttendanceReportCard = ({ data }: AttendanceReportCardProps) => {
  const attendanceData = data.map((item) => ({
    course: item?.course_title,
    classes_attended: item?.classes_attended,
    classes_completed: Number(item?.classes_completed),
    total_classes: item?.total_classes,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <CardTitle className="text-xl text-secondary font-semibold">
          Class Attendance Report
        </CardTitle>

        {/* Custom Legend - Right side, top */}
        <div className="flex gap-4 mt-2 lg:mt-0">
          {chartConfig.map((item) => (
            <div key={item.key} className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-secondary font-medium">
                {item?.label}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[400px] lg:h-[500px] w-full">
        <ChartContainer
          config={Object.fromEntries(
            chartConfig.map((item) => [
              item.key,
              { label: item.label, color: item.color },
            ])
          )}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData} barGap={8} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="course"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                height={60}
                interval={0}
                angle={0}
                textAnchor="middle"

              />

              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75,90, 100]}
                unit="%"
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              {chartConfig.map((item) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={item.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  <LabelList
                    position="top"
                    content={(props: any) => {
                      const entry = props.payload;
                      if (!entry) return null;
                      return (
                        <text
                          x={props.x}
                          y={props.y - 5}
                          fill="#374151"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          {`${entry[item.key]}/${entry[item.totalKey]}`}
                        </text>
                      );
                    }}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceReportCard;
