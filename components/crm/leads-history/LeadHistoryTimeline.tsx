import { LeadHistory } from "@/apiServices/crmLeadsHistoryService";
import { Phone, MessageSquare, GraduationCap, Star, Clock } from "lucide-react";

interface LeadHistoryTimelineProps {
  histories: LeadHistory[];
}

const LeadHistoryTimeline = ({ histories }: LeadHistoryTimelineProps) => {
  const getIcon = (typeText: string | undefined, statusText: string | undefined) => {
    if (statusText?.toLowerCase() === "enrolled") return <GraduationCap className="w-5 h-5 text-green-600" />;
    if (statusText?.toLowerCase() === "interested") return <Star className="w-5 h-5 text-purple-600" />;
    if (typeText?.toLowerCase() === "call") return <Phone className="w-5 h-5 text-blue-600" />;
    if (typeText?.toLowerCase() === "message") return <MessageSquare className="w-5 h-5 text-orange-600" />;
    return <Clock className="w-5 h-5 text-slate-500" />;
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
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {histories.map((history) => (
        <div key={history.id} className="relative flex items-start group">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getIconBg(history.status_text)} shrink-0 z-10 shadow-sm border border-white`}>
            {getIcon(history.type_text, history.status_text)}
          </div>
          <div className="flex-grow ml-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-800">{history.status_text || history.type_text}</h4>
                <div className="flex items-center text-blue-600">
                    {history.type_text?.toLowerCase() === "call" && <Phone className="w-4 h-4 mr-2" />}
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500 mb-4">
                {formatDate(history.date || history.created_at)}
                <span className="mx-2">•</span>
                {formatTime(history.created_at)}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                {history.note}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadHistoryTimeline;
