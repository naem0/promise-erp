
"use client";

import LeadHistoryTimeline from "./LeadHistoryTimeline";
import LeadHistoryForm from "./LeadHistoryForm";
import LeadActionCard from "./LeadActionCard";
import { LeadHistory, LeadInfo } from "@/apiServices/crmLeadsHistoryService";

const LeadHistoryManagement = ({ 
  leadHistories, 
  leadInfo 
}: { 
  leadHistories: LeadHistory[],
  leadInfo: LeadInfo 
}) => {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Call History Timeline</h2>
          <p className="text-slate-500 text-sm mt-1">Track all interactions and follow-up with this leads</p>
        </div>

        { leadHistories.length > 0 ? (
          <LeadHistoryTimeline histories={leadHistories} />
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-400">No history found for this lead.</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <LeadActionCard lead={leadInfo} />
          <LeadHistoryForm leadId={leadHistories[0]?.lead_id} />
        </div>
      </div>
    </div>
  );
};

export default LeadHistoryManagement;
