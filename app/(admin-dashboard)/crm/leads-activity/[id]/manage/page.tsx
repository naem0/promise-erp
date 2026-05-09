import LeadActivityManagement from "@/components/crm/leads-activity/LeadActivityManagement";
import LeadInfoCard from "@/components/crm/leads-activity/LeadInfoCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLeadActivitiesByLeadId } from "@/apiServices/crmLeadsActivityService";
 
export default async function LeadManagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const leadId = Number(id);
 
    let leadData;
    try {
      const res = await getLeadActivitiesByLeadId(leadId);
      if (res.success) {
        leadData = res.data
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    }
 
    return (
        <div className="mx-auto space-y-8 max-w-[1600px] p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full">
                        <Link href="/crm/leads-activity">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Manage Lead Interaction</h1>
                </div>
            </div>
 
            {leadData && <LeadInfoCard lead={leadData.lead_info} />}
 
            {leadData && <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <LeadActivityManagement leadActivities={leadData.activities} leadInfo={leadData.lead_info} />
            </div>}
        </div>
    );
}