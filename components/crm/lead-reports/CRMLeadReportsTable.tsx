"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table";
import { CRMLeadReportsItem, CRMLeadReportsSummary } from "@/apiServices/crmLeadReportsService";
import { Badge } from "@/components/ui/badge";

interface CRMLeadReportsTableProps {
    data: CRMLeadReportsItem[];
    summary?: CRMLeadReportsSummary;
    page: number;
    perPage: number;
}

export default function CRMLeadReportsTable({
    data,
    summary,
    page,
    perPage,
}: CRMLeadReportsTableProps) {
    return (
        <div className="rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[60px] text-center font-semibold">SI</TableHead>
                        <TableHead className="font-semibold min-w-[150px]">Counsellor</TableHead>
                        <TableHead className="font-semibold min-w-[200px]">Course</TableHead>
                        <TableHead className="font-semibold">Branch</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold text-center">Assigned</TableHead>
                        <TableHead className="font-semibold text-center">Contacted</TableHead>
                        <TableHead className="font-semibold text-center">Enrolled</TableHead>
                        <TableHead className="font-semibold text-center">Follow Up</TableHead>
                        <TableHead className="font-semibold text-center">Interested</TableHead>
                        <TableHead className="font-semibold text-center">Lost</TableHead>
                        <TableHead className="font-semibold text-center">Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={`${item.user_id}-${item.course_id}-${item.branch_id}-${item.date}`} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="text-center text-slate-500 font-medium">
                                {(page - 1) * perPage + index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                                {item.consultant_name}
                            </TableCell>
                            <TableCell className="text-slate-700 max-w-[300px]">
                                {item.course_name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
                                    {item.branch_name}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600 whitespace-nowrap">
                                {item.date}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-slate-900">
                                {item.total_assigned}
                            </TableCell>
                            <TableCell className="text-center text-blue-600 font-medium">
                                {item.contacted}
                            </TableCell>
                            
                            <TableCell className="text-center font-semibold text-green-600">
                                {item.enrolled}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 font-medium">
                                {item.follow_up}
                            </TableCell>
                            <TableCell className="text-center text-cyan-600 font-medium">
                                {item.interested}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                                {item.lost}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-medium">
                                    {item.target_progress}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {summary && (
                    <TableFooter className="bg-slate-100 font-bold border-t-2 border-slate-200">
                        <TableRow>
                            <TableCell colSpan={5} className="text-right pr-4 text-slate-900 uppercase tracking-wider">Total</TableCell>
                            <TableCell className="text-center text-slate-900">{summary.total_assigned}</TableCell>
                            <TableCell className="text-center text-blue-700">{summary.total_contacted}</TableCell>
                            <TableCell className="text-center text-green-700">{summary.total_enrolled}</TableCell>
                            <TableCell className="text-center text-orange-700">{summary.total_follow_up}</TableCell>
                            <TableCell className="text-center text-cyan-700">{summary.total_interested}</TableCell>
                            <TableCell className="text-center text-red-700">{summary.total_lost}</TableCell>
                            <TableCell className="text-center text-indigo-700">{summary.total_target_progress}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
