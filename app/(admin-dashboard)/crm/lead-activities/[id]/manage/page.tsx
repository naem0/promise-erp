import LeadActivityManagement from "@/components/crm/lead-activities/LeadActivitiesManagement";
import LeadInfoCard from "@/components/crm/lead-activities/LeadInfoCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLeadActivitiesByLeadId } from "@/apiServices/crmLeadActivitiesService";
 
export default async function LeadManagePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const leadId = Number(id);
    
 
    const resolvedSearchParams = await searchParams;
    const searchParamsString = new URLSearchParams(
        Object.entries(resolvedSearchParams).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(v => acc.append(key, v));
                } else {
                    acc.append(key, value);
                }
            }
            return acc;
        }, new URLSearchParams())
    ).toString();
    const backUrl = `/crm/lead-activities${searchParamsString ? `?${searchParamsString}` : ""}`;
 
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
        <div className="mx-auto space-y-8 max-w-[1600px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full">
                        <Link href={backUrl}>
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