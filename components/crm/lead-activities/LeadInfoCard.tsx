"use client";

import { LeadInfo } from "@/apiServices/crmLeadActivitiesService";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

interface LeadInfoCardProps {
    lead: LeadInfo;
}

const LeadInfoCard = ({ lead }: LeadInfoCardProps) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
            <div className="space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight wrap-break whitespace-normal">
                        {lead.name}
                    </h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-4">
                    {/* Contact Information */}
                    <div className="space-y-2 min-w-0">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">
                            Contact Information
                        </h3>

                        <Table className="border-none shadow-none table-fixed w-full">
                            <TableBody>
                                {lead.email && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 w-24 align-top">
                                            Email
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.email}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.phone && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Phone
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.phone}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.whatsapp && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            WhatsApp
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.whatsapp}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.address && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Address
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.address}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.branch_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Branch
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.branch_name}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.profession && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Profession
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.profession}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.institute && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Institute
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.institute}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.age !== undefined && lead.age !== null && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Age
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.age}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Course & Source */}
                    <div className="space-y-2 min-w-0">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">
                            Course & Source
                        </h3>

                        <Table className="border-none shadow-none table-fixed w-full">
                            <TableBody>
                                {lead.interested_course && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 w-24 align-top">
                                            Course
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal leading-snug">
                                            {lead.interested_course}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.course_type_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Type
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.course_type_name}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.shift_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Shift
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.shift_name}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.status_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Status
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium text-blue-600 wrap-break whitespace-normal">
                                            {lead.status_name}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Referrer Details */}
                    <div className="space-y-2 min-w-0">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">
                            Referrer Details
                        </h3>

                        <Table className="border-none shadow-none table-fixed w-full">
                            <TableBody>
                                {lead.referrer_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 w-24 align-top">
                                            Name
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.referrer_name}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.referrer_phone && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Phone
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.referrer_phone}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {lead.source_name && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell className="py-2 pl-1 pr-4 align-top">
                                            Source
                                        </TableCell>

                                        <TableCell className="py-2 px-0 font-medium wrap-break whitespace-normal">
                                            {lead.source_name}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadInfoCard;