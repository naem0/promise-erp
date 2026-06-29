"use client";
 
import LeadActivityTimeline from "./LeadActivitesTimeline";
import LeadActivityForm from "./LeadActivitiesForm";
import LeadActionCard from "./LeadActionCard";
import { LeadActivity, LeadInfo } from "@/apiServices/crmLeadActivitiesService";
 
const LeadActivityManagement = ({ 
  leadActivities, 
  leadInfo 
}: { 
  leadActivities: LeadActivity[],
  leadInfo: LeadInfo 
}) => {

  const lastLeadActivity = leadActivities[0]?.status_text;
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Activity Timeline</h2>
          <p className="text-slate-500 text-sm mt-1">Track all interactions and follow-up with this leads</p>
        </div>
 
        { leadActivities.length > 0 ? (
          <LeadActivityTimeline activities={leadActivities} />
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-400">No activity found for this lead.</p>
          </div>
        )}
      </div>
 
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-6">
          <LeadActionCard lead={leadInfo} />
          <LeadActivityForm leadId={leadInfo?.id ?? 0} lastLeadActivityStatus={lastLeadActivity} />
        </div>
      </div>
    </div>
  );
};
 
export default LeadActivityManagement;
