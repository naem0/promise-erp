import { LeadInfo } from "@/apiServices/crmLeadsHistoryService";

interface LeadInfoCardProps {
    lead: LeadInfo;
}

const LeadInfoCard = ({ lead }: LeadInfoCardProps) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="space-y-3">
                <h2 className="text-[28px] font-bold text-slate-900 leading-tight">{lead.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 pt-1">

                    <div className="flex gap-1.5 text-[15px]">
                        <span className="text-slate-500">Email:</span>
                        <span className="text-slate-700">{lead.email || "—"}</span>
                    </div>
                    <div className="flex gap-1.5 text-[15px]">
                        <span className="text-slate-500">Phone:</span>
                        <span className="text-slate-700">{lead.phone || "—"}</span>

                    </div>
                    <div className="md:col-span-2 flex gap-1.5 text-[15px]">
                        <span className="text-slate-500">Interest Batch :</span>
                        <span className="text-slate-800 font-medium">{lead.interested_batch || "—"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadInfoCard;
