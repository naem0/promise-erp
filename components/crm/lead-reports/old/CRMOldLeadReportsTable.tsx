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
import { CRMOldLeadReportsItem, CRMLeadReportsSummary } from "@/apiServices/crmLeadReportsService";
import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/utils";

interface CRMOldLeadReportsTableProps {
    data: CRMOldLeadReportsItem[];
    summary?: CRMLeadReportsSummary;
    page: number;
    perPage: number;
}

export default function CRMOldLeadReportsTable({
    data,
    summary,
    page,
    perPage,
}: CRMOldLeadReportsTableProps) {
    return (
        <div className="rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[60px] text-center font-semibold">SI</TableHead>
                        <TableHead className="font-semibold min-w-[150px]">Counsellor</TableHead>
                        <TableHead className="font-semibold min-w-[200px]">Course</TableHead>
                        <TableHead className="font-semibold">Branch</TableHead>
                        <TableHead className="font-semibold text-center">Total Lead</TableHead>
                        <TableHead className="font-semibold text-center">Contacted</TableHead>
                        <TableHead className="font-semibold text-center">Busy</TableHead>
                        <TableHead className="font-semibold text-center">Interested</TableHead>
                        <TableHead className="font-semibold text-center">Follow Up</TableHead>
                        <TableHead className="font-semibold text-center">Enrolled</TableHead>
                        <TableHead className="font-semibold text-center">Cancelled</TableHead>
                        <TableHead className="font-semibold text-center">Not Received</TableHead>
                        <TableHead className="font-semibold text-center">Call Rejected</TableHead>
                        <TableHead className="font-semibold text-center">Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) => (
                        <TableRow key={`${item.user_id}-${item.course_id}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="text-center text-slate-500 font-medium">
                                {(page - 1) * perPage + index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900" title={item.consultant_name}>
                                {truncate(item.consultant_name, 30)}
                            </TableCell>
                            <TableCell className="text-slate-700 max-w-[300px]" title={item.course_name}>
                                {truncate(item.course_name, 30)}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1 items-center">
                                    {(() => {
                                        const branches = item.branch || [];
                                        const visible = branches.slice(0, 2);
                                        const overflow = branches.length - 2;
                                        return (
                                            <>
                                                {visible.map((b) => (
                                                    <Badge
                                                        key={b.branch_id}
                                                        variant="secondary"
                                                        className="bg-amber-50 text-amber-700 border-amber-100 font-normal"
                                                    >
                                                        {b.branch_name}
                                                    </Badge>
                                                ))}
                                                {overflow > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-slate-100 text-slate-600 border-slate-200 font-normal"
                                                        title={branches.slice(2).map(b => b.branch_name).join(", ")}
                                                    >
                                                        +{overflow}
                                                    </Badge>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold text-slate-800">
                                {item.total_lead}
                            </TableCell>
                            <TableCell className="text-center text-blue-600 font-semibold">
                                {item.contacted}
                            </TableCell>
                            <TableCell className="text-center text-purple-600 font-medium">
                                {item.busy}
                            </TableCell>
                            <TableCell className="text-center text-cyan-600 font-medium">
                                {item.interested}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 font-medium">
                                {item.follow_up}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-green-600">
                                {item.enrolled}
                            </TableCell>
                            <TableCell className="text-center text-rose-600 font-medium">
                                {item.lost}
                            </TableCell>
                            <TableCell className="text-center text-zinc-600 font-medium">
                                {item.not_received}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                                {item.call_rejected}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-medium">
                                    {item.target_progress}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {summary && (
                    <TableFooter className="bg-slate-100 font-bold border-t-2 border-slate-200">
                        <TableRow>
                            <TableCell colSpan={4} className="text-right pr-4 text-slate-900 uppercase tracking-wider">Total</TableCell>
                            <TableCell className="text-center text-slate-800">{summary.total_lead}</TableCell>
                            <TableCell className="text-center text-blue-700">{summary.total_contacted}</TableCell>
                            <TableCell className="text-center text-gray-700">{summary.total_new}</TableCell>
                            <TableCell className="text-center text-purple-700">{summary.total_busy}</TableCell>
                            <TableCell className="text-center text-cyan-700">{summary.total_interested}</TableCell>
                            <TableCell className="text-center text-orange-700">{summary.total_follow_up}</TableCell>
                            <TableCell className="text-center text-green-700">{summary.total_enrolled}</TableCell>
                            <TableCell className="text-center text-rose-700">{summary.total_lost}</TableCell>
                            <TableCell className="text-center text-zinc-700">{summary.total_not_received}</TableCell>
                            <TableCell className="text-center text-red-700">{summary.total_call_rejected}</TableCell>
                            <TableCell className="text-center text-amber-700">{summary.total_target_progress}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
