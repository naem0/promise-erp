"use client";

import { Fragment } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table";
import { CRMLeadReportsConsultantItem, CRMLeadReportsTotalGroup } from "@/apiServices/crmLeadReportsService";
import { truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CRMLeadReportsTableProps {
    data: CRMLeadReportsConsultantItem[];
    summary?: CRMLeadReportsTotalGroup;
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
        <div className="rounded-md border bg-white overflow-x-auto shadow-sm max-w-full">
            <Table className="min-w-[1800px] border-collapse text-xs border border-slate-200">
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                    {/* Row 1 Headers */}
                    <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                        <TableHead className="w-[80px] text-center font-semibold text-slate-800 border-r border-slate-300" rowSpan={2}>#SL</TableHead>
                        <TableHead className="font-semibold text-slate-800 border-r border-slate-200 min-w-[150px]" rowSpan={2}>Consultant</TableHead>
                        <TableHead className="font-semibold text-slate-800 border-r border-slate-200 min-w-[180px]" rowSpan={2}>Course Name</TableHead>
                        <TableHead className="font-semibold text-slate-800 border-r border-slate-200 min-w-[120px]" rowSpan={2}>Branch</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={2}>Leads</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={4}>Assigned</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={4}>Contacted</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={2}>Remaining</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Busy</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Interested</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Follow Up</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Enrolled</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Cancelled</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Not Received</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800 border-r border-slate-300" colSpan={3}>Call Rejected</TableHead>
                        <TableHead className="text-center font-semibold text-slate-800" rowSpan={2}>Progress</TableHead>
                    </TableRow>

                    {/* Row 2 Sub-Headers */}
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        {/* Leads */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-rose-500">Total</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">Available</TableHead>
                        {/* Assigned */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-secondary">Follow Up</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Contacted */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-secondary">Follow Up</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Remaining */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-secondary">Follow Up</TableHead>
                        {/* Busy */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-secondary">Follow Up</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Interested */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Follow Up */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Enrolled */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Cancelled */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Not Received */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                        {/* Call Rejected */}
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-emerald-500">New</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-amber-500">Work L</TableHead>
                        <TableHead className="text-center font-semibold text-[10px] py-1 border-r border-slate-200 text-slate-500">Old</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((item, index) => {
                        const courses = item.courses || [];
                        const hasCourses = courses.length > 0;
                        const rowSpanCount = hasCourses ? courses.length + 1 : 1;

                        // If the consultant has no courses, handle it gracefully
                        if (!hasCourses) {
                            return (
                                <TableRow key={`${item.user_id}-empty`} className="hover:bg-slate-50/50 border-b border-slate-200">
                                    <TableCell className="text-center text-slate-500 font-medium border-r border-slate-200">
                                        <div className="flex items-center justify-center gap-2">
                                            <span>{String((page - 1) * perPage + index + 1).padStart(2, '0')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-900 border-r border-slate-200" title={item.consultant_name}>
                                        {truncate(item.consultant_name, 20)}
                                    </TableCell>
                                    <TableCell className="text-slate-400 border-r border-slate-200 italic">No courses assigned</TableCell>
                                    <TableCell className="text-slate-600 border-r border-slate-200">{item.branch?.[0]?.branch_name || ""}</TableCell>
                                    <TableCell className="text-center border-r border-slate-200" colSpan={34} />
                                </TableRow>
                            );
                        }

                        return (
                            <Fragment key={item.user_id || index}>
                                {courses.map((course, courseIndex) => (
                                    <TableRow key={`${item.user_id}-${course.course_id}-${courseIndex}`} className="hover:bg-slate-50/50 border-b border-slate-200 transition-colors">
                                        {courseIndex === 0 && (
                                            <>
                                                <TableCell rowSpan={rowSpanCount} className="text-center text-slate-500 font-medium border-r border-slate-200 bg-white align-middle">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>{String((page - 1) * perPage + index + 1).padStart(2, '0')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell rowSpan={rowSpanCount} className="font-semibold text-slate-900 border-r border-slate-200 bg-white align-middle" title={item.consultant_name}>
                                                    {truncate(item.consultant_name, 20)}
                                                </TableCell>
                                            </>
                                        )}

                                        <TableCell className="text-slate-700 max-w-[200px] border-r border-slate-300" title={course.course_name}>
                                            {truncate(course.course_name, 30)}
                                        </TableCell>

                                        <TableCell className="text-slate-600 border-r border-slate-200 align-middle">
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
                                                                    className="bg-primary text-white border-blue-100 font-normal whitespace-nowrap text-[10px] py-0 px-1.5"
                                                                >
                                                                    {b.branch_name}
                                                                </Badge>
                                                            ))}
                                                            {overflow > 0 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-slate-100 text-slate-600 border-slate-200 font-normal text-[10px] py-0 px-1.5 cursor-help"
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

                                        {/* Leads T, A */}
                                        <TableCell className="text-center font-medium text-rose-600 border-r border-slate-200 bg-rose-50/5">
                                            {course.leads?.["total-leads"] ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.leads?.["available-leads"] ?? 0}
                                        </TableCell>

                                        {/* Assigned N, F, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.assigned?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-secondary border-r border-slate-200 bg-purple-50/10">
                                            {course.assigned?.followup ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.assigned?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.assigned?.old ?? 0}
                                        </TableCell>

                                        {/* Contacted N, F, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.contacted?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-secondary border-r border-slate-200 bg-purple-50/10">
                                            {course.contacted?.followup ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.contacted?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.contacted?.old ?? 0}
                                        </TableCell>

                                        {/* Remaining N, F */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.remaining?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-secondary border-r border-slate-200 bg-purple-50/10">
                                            {course.remaining?.followup ?? 0}
                                        </TableCell>

                                        {/* Busy N, F, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.busy?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-secondary border-r border-slate-200 bg-purple-50/10">
                                            {course.busy?.followup ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.busy?.old ?? 0}
                                        </TableCell>

                                        {/* Interested N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.interested?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.interested?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.interested?.old ?? 0}
                                        </TableCell>

                                        {/* Follow Up N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.follow_up?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.follow_up?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.follow_up?.old ?? 0}
                                        </TableCell>

                                        {/* Enrolled N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.enrolled?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.enrolled?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.enrolled?.old ?? 0}
                                        </TableCell>

                                        {/* Cancelled N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.cancelled?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.cancelled?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.cancelled?.old ?? 0}
                                        </TableCell>

                                        {/* Not Received N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.not_received?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.not_received?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.not_received?.old ?? 0}
                                        </TableCell>

                                        {/* Call Rejected N, W, O */}
                                        <TableCell className="text-center font-medium text-emerald-600 border-r border-slate-200 bg-emerald-50/10">
                                            {course.call_rejected?.new ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-amber-600 border-r border-slate-200 bg-amber-50/10">
                                            {course.call_rejected?.working ?? 0}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-slate-500 border-r border-slate-300">
                                            {course.call_rejected?.old ?? 0}
                                        </TableCell>

                                        {/* Progress */}
                                        <TableCell className="text-center border-r border-slate-300">
                                            {course.target_progress}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* Consultant Total Row */}
                                <TableRow key={`${item.user_id}-total`} className="bg-primary/20 font-semibold hover:bg-primary/30 border-b-2 border-slate-200 transition-colors">
                                    <TableCell className="border-r border-slate-200 text-lime-900 font-bold">
                                        Total [{truncate(item.consultant_name, 20)}]
                                    </TableCell>

                                    <TableCell className="border-r border-slate-200" /> {/* Empty Branch */}

                                    {/* Leads T, A */}
                                    <TableCell className="text-center text-rose-600 border-r border-slate-200 font-bold bg-rose-50/5">
                                        {item.total?.leads?.["total-leads"] ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.leads?.["available-leads"] ?? 0}
                                    </TableCell>

                                    {/* Assigned N, F, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.assigned?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-secondary border-r border-slate-200 font-bold bg-purple-50/5">
                                        {item.total?.assigned?.followup ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.assigned?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.assigned?.old ?? 0}
                                    </TableCell>

                                    {/* Contacted N, F, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.contacted?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-secondary border-r border-slate-200 font-bold bg-purple-50/5">
                                        {item.total?.contacted?.followup ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.contacted?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.contacted?.old ?? 0}
                                    </TableCell>

                                    {/* Remaining N, F */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.remaining?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-secondary border-r border-slate-200 font-bold bg-purple-50/5">
                                        {item.total?.remaining?.followup ?? 0}
                                    </TableCell>

                                    {/* Busy N, F, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.busy?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-secondary border-r border-slate-200 font-bold bg-purple-50/5">
                                        {item.total?.busy?.followup ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.busy?.old ?? 0}
                                    </TableCell>

                                    {/* Interested N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.interested?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.interested?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.interested?.old ?? 0}
                                    </TableCell>

                                    {/* Follow Up N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.follow_up?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.follow_up?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.follow_up?.old ?? 0}
                                    </TableCell>

                                    {/* Enrolled N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.enrolled?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.enrolled?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.enrolled?.old ?? 0}
                                    </TableCell>

                                    {/* Cancelled N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.cancelled?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.cancelled?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.cancelled?.old ?? 0}
                                    </TableCell>

                                    {/* Not Received N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.not_received?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.not_received?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.not_received?.old ?? 0}
                                    </TableCell>

                                    {/* Call Rejected N, W, O */}
                                    <TableCell className="text-center text-emerald-600 border-r border-slate-200 font-bold bg-emerald-50/5">
                                        {item.total?.call_rejected?.new ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-amber-600 border-r border-slate-200 font-bold bg-amber-50/5">
                                        {item.total?.call_rejected?.working ?? 0}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 border-r border-slate-200 font-bold">
                                        {item.total?.call_rejected?.old ?? 0}
                                    </TableCell>

                                    {/* Progress */}
                                    <TableCell className="text-center border-r border-slate-200">
                                        {item.total?.target_progress}
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        );
                    })}
                </TableBody>

                {summary && (
                    <TableFooter className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                        <TableRow className="hover:bg-slate-800 transition-colors">
                            <TableCell colSpan={4} className="text-left pl-6 text-white uppercase tracking-wider font-extrabold border-r border-slate-700">
                                Grand Total
                            </TableCell>

                            {/* Leads T, A */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.leads?.["total-leads"] ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.leads?.["available-leads"] ?? 0}
                            </TableCell>

                            {/* Assigned N, F, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.assigned?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.assigned?.followup ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.assigned?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.assigned?.old ?? 0}
                            </TableCell>

                            {/* Contacted N, F, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.contacted?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.contacted?.followup ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.contacted?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.contacted?.old ?? 0}
                            </TableCell>

                            {/* Remaining N, F */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.remaining?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.remaining?.followup ?? 0}
                            </TableCell>

                            {/* Busy N, F, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.busy?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.busy?.followup ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.busy?.old ?? 0}
                            </TableCell>

                            {/* Interested N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.interested?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.interested?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.interested?.old ?? 0}
                            </TableCell>

                            {/* Follow Up N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.follow_up?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.follow_up?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.follow_up?.old ?? 0}
                            </TableCell>

                            {/* Enrolled N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.enrolled?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.enrolled?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.enrolled?.old ?? 0}
                            </TableCell>

                            {/* Cancelled N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.cancelled?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.cancelled?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.cancelled?.old ?? 0}
                            </TableCell>

                            {/* Not Received N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.not_received?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.not_received?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.not_received?.old ?? 0}
                            </TableCell>

                            {/* Call Rejected N, W, O */}
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.call_rejected?.new ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold bg-slate-800/30">
                                {summary.call_rejected?.working ?? 0}
                            </TableCell>
                            <TableCell className="text-center text-white border-r border-slate-700 font-extrabold">
                                {summary.call_rejected?.old ?? 0}
                            </TableCell>

                            {/* Progress */}
                            <TableCell className="text-center font-extrabold">
                                {summary.target_progress}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
