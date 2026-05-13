import { LeadActivity } from "@/apiServices/crmLeadActivitiesService";
import { Phone, MessageSquare, GraduationCap, Star, Clock, Mail, MessageCircle } from "lucide-react";
 
interface LeadActivityTimelineProps {
  activities: LeadActivity[];
}
 
const LeadActivityTimeline = ({ activities }: LeadActivityTimelineProps) => {
  const getIcon = (type: number | undefined, statusText: string | undefined) => {
    const status = statusText?.toLowerCase();
    if (status === "enrolled") return <GraduationCap className="w-5 h-5 text-primary" />;
    if (status === "interested") return <Star className="w-5 h-5 text-purple-600" />;
    
    switch (type) {
        case 1: return <Phone className="w-5 h-5 text-secondary" />;
        case 2: return <MessageSquare className="w-5 h-5 text-[#9148EF]" />;
        case 3: return <Mail className="w-5 h-5 text-sky-600" />;
        case 4: return <MessageCircle className="w-5 h-5 text-primary" />;
        default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };
 
  const getIconBg = (statusText: string | undefined) => {
      if (statusText?.toLowerCase() === "enrolled") return "bg-green-100";
      if (statusText?.toLowerCase() === "interested") return "bg-purple-100";
      return "bg-blue-50";
  };
 
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };
 
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };
 
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {activities.map((activity) => (
        <div key={activity.id} className="relative flex items-start group">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getIconBg(activity.status_text)} shrink-0 z-10 shadow-sm border border-white`}>
            {getIcon(activity.type, activity.status_text)}
          </div>
          <div className="grow ml-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-800">{activity.status_text || activity.type_text}</h4>
                </div>
                <div className="flex items-center text-blue-600">
                    {activity.type === 1 && <Phone className="w-4 h-4 mr-2" />}
                    {activity.type === 2 && <MessageSquare className="w-4 h-4 mr-2 text-orange-600" />}
                    {activity.type === 3 && <Mail className="w-4 h-4 mr-2 text-sky-600" />}
                    {activity.type === 4 && <MessageCircle className="w-4 h-4 mr-2 text-primary" />}
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500 mb-4">
                {formatDate(activity.date || activity.created_at)}
                <span className="mx-2">•</span>
                {formatTime(activity.created_at)}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                {activity.note}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
 
export default LeadActivityTimeline;
