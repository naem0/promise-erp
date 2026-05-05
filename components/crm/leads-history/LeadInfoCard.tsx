import { LeadInfo } from "@/apiServices/crmLeadsHistoryService";
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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">{lead.name}</h2>    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">Contact Information</h3>
                        <Table className="border-none shadow-none">
                            <TableBody>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4 w-20">Email</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.email || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Phone</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.phone || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Address</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.address || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Branch</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.branch_name || "—"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Course & Source */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">Course & Source</h3>
                        <Table className="border-none shadow-none">
                            <TableBody>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4 w-[100px]">Course</TableCell>
                                    <TableCell className="py-2 px-0 font-medium leading-snug">{lead.interested_course || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Type</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.course_type_name || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Shift</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.shift_name || "—"}</TableCell>
                                </TableRow>
                                
                                
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Status</TableCell>
                                    <TableCell className="py-2 px-0 font-medium text-blue-600">{lead.status_name|| "—"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Referrer Details */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1">Referrer Details</h3>
                        <Table className="border-none shadow-none">
                            <TableBody>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4 w-[80px]">Name</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.referrer_name || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Phone</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.referrer_phone || "—"}</TableCell>
                                </TableRow>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell className="py-2 pl-1 pr-4">Source</TableCell>
                                    <TableCell className="py-2 px-0 font-medium">{lead.source_name || "—"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadInfoCard;
