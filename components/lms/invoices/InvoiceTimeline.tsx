import { PaymentTimelineItem } from "@/apiServices/invoiceService";
import { Calendar, Clock, Receipt, Mail } from "lucide-react";

interface InvoiceTimelineProps {
  timeline: PaymentTimelineItem[];
}

const timelineIcons = [Calendar, Receipt, Receipt, Mail];

export function InvoiceTimeline({ timeline }: InvoiceTimelineProps) {
  return (
    <div className="bg-white rounded-xl border p-6 xl:col-span-5 print-card">
      <h3 className="text-base font-bold text-secondary mb-6 pb-2 border-b border-gray-100">
        Payment Timeline
      </h3>
      <div className="relative pl-7 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
        {timeline.map((item, idx) => {
          const IconComponent = timelineIcons[idx % timelineIcons.length];
          return (
            <div key={idx} className="relative flex flex-col gap-2">
              {/* Visual Timeline Icons */}
              <div className="absolute -left-[28px] top-[2px] w-6 h-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-secondary me-2">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900">
                {item?.title}
              </h4>
              <span className="text-xs text-gray-500">{item?.subtitle}</span>
              <span className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item?.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
