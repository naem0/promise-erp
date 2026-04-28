import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ExportRunningBatchesButton from "./ExportRunningBatchesButton";
import { RunningBatch } from "@/apiServices/adminDashboardService";
import { truncate } from "@/lib/utils";

interface DashboardRunningBatchesProps {
  runningBatches: RunningBatch[];
}
const DashboardRunningBatches = ({
  runningBatches,
}: DashboardRunningBatchesProps) => {
  return (
    <Card className="rounded-2xl shadow-md border bg-white">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Running Batches
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            List of Running Batches
          </p>
        </div>

        <ExportRunningBatchesButton runningBatches={runningBatches} />
      </CardHeader>

      {/* Table */}
      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/60 px-2">
              <TableRow>
                <TableHead className="px-2 text-white">#SL</TableHead>
                <TableHead className="px-2 text-white">Course</TableHead>
                <TableHead className="px-2 text-white">Batch</TableHead>
                <TableHead className="px-2 text-white">Start Date</TableHead>
                <TableHead className="px-2 text-white">End Date</TableHead>
                <TableHead className="px-2 text-white">
                  Total Students
                </TableHead>
                <TableHead className="px-2 text-white">Present Today</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {runningBatches?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4">{index + 1}</TableCell>
                  <TableCell className="text-secondary font-medium px-2">
                    {truncate(item?.course, 20)}
                  </TableCell>
                  <TableCell className="px-2">{item?.batch}</TableCell>
                  <TableCell className="px-2">{item?.start_date}</TableCell>
                  <TableCell className="px-2">{item?.end_date}</TableCell>
                  <TableCell className="px-2 text-center">
                    {item?.total_students}
                  </TableCell>

                  <TableCell className="px-2 text-center">
                    <Badge
                      className={`${item?.present_today ? "bg-primary text-white" : "bg-red-200"} text-center text-black px-4 py-1 rounded-full `}
                    >
                      {item?.present_today}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRunningBatches;
