import React from "react";
import { Check, X } from "lucide-react";
import { Requisition } from "@/apiServices/requisitionsService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface ApprovalHierarchyListProps {
  requisition: Requisition;
}

const ApprovalHierarchyList = ({ requisition }: ApprovalHierarchyListProps) => {
  const approvalDashboard = requisition?.approval_dashboard || [];

  const getBottomStatusStyle = (status: number) => {
    switch (status) {
      case 1:
        return "bg-[#15803d] text-white";
      case 2:
        return "bg-red-600 text-white";
      case 0:
      default:
        return "bg-slate-400 text-white";
    }
  };

  if (approvalDashboard.length === 0) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message="No approval steps available." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-0.5 relative pl-1">
        {approvalDashboard?.map((step, index) => {
          const isApproved = step.status === 1;
          const isRejected = step.status === 2;

          let circleBg = "bg-slate-300";
          let cardBg = "bg-[#f8fafc] border-slate-200/60";
          let titleColor = "text-slate-400";
          let dateColor = "text-slate-400";
          let noteColor = "text-slate-400";
          let Icon = Check;

          if (isApproved) {
            circleBg = "bg-[#15803d]"; // Green
            cardBg = "bg-[#f2fcf5] border-[#e1f7e7]";
            titleColor = "text-[#15803d]";
            dateColor = "text-slate-600";
            noteColor = "text-slate-600";
            Icon = Check;
          } else if (isRejected) {
            circleBg = "bg-red-600"; // Red
            cardBg = "bg-red-50/60 border-red-100";
            titleColor = "text-red-600";
            dateColor = "text-slate-500";
            noteColor = "text-slate-500";
            Icon = X;
          }

          return (
            <div key={index} className="relative flex gap-5 pb-6 last:pb-2">
              {/* Connector Line */}
              {index < approvalDashboard.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-100" />
              )}

              {/* Circle Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-white shrink-0 shadow-sm transition-colors duration-200 ${circleBg}`}
              >
                <Icon className="w-4 h-4 stroke-3" />
              </div>

              {/* Card */}
              <div
                className={`flex-1 border rounded-2xl p-4 transition-all duration-200 hover:shadow-sm ${cardBg}`}
              >
                <div className="flex flex-col gap-1">
                  <h4
                    className={`text-sm font-semibold tracking-tight ${titleColor}`}
                  >
                    {step?.role_name || "—"}
                  </h4>

                    <p className={`text-[11px] font-medium ${dateColor}`}>
                      By: {step.actioned_by || "—"}
                    </p>
                    <p className={`text-[11px] font-medium ${dateColor}`}>
                      Date: {step.actioned_at || "—"}
                    </p>
                  <p className={`text-[11px] mt-0.5 ${noteColor}`}>
                    <span className="font-semibold">Note : </span>
                    {step?.note || "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom overall status banner */}
      <div
        className={`w-full py-3 px-4 rounded-xl font-semibold text-center text-sm shadow-sm tracking-wide select-none transition-all duration-200 ${getBottomStatusStyle(
          requisition.status,
        )}`}
      >
        {requisition.status_text || "Pending"}
      </div>
    </div>
  );
};

export default ApprovalHierarchyList;
