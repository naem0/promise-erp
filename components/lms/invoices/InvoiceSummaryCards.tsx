import { InvoiceSummary } from "@/apiServices/invoiceService";
import { Clock, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface InvoiceSummaryCardsProps {
  summary: InvoiceSummary;
}

export function InvoiceSummaryCards({ summary }: InvoiceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-primary text-white p-6 rounded-lg shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center font-bold text-lg">
            ৳
          </div>
          <span className="text-lg font-medium">Total Revenue</span>
        </div>
        <div className="text-3xl font-bold">
          ৳ {summary?.total_revenue ?? 0}
        </div>
      </div>

      {/* Pending Invoice */}
      <div className="bg-[#f08c16] text-white p-6 rounded-lg shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <Clock size={18} />
          </div>
          <span className="text-lg font-medium">Pending Invoice</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {summary?.pending_invoices ?? 0}
          </span>
          <span className="text-sm font-medium opacity-90">Invoices</span>
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-[#f43f5e] text-white p-6 rounded-lg shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
          <span className="text-lg font-medium">Overdue</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {summary?.overdue_invoices ?? 0}
          </span>
          <span className="text-sm font-medium opacity-90">Invoices</span>
        </div>
      </div>

      {/* Total Invoices */}
      <div className="bg-[#2563eb] text-white p-6 rounded-lg shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <FileText size={18} />
          </div>
          <span className="text-lg font-medium">Total Invoices</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {summary?.total_invoices ?? 0}
          </span>
          <span className="text-sm font-medium opacity-90">Invoices</span>
        </div>
      </div>

      {/* Paid Invoices */}
      <div className="bg-[#059669] text-white p-6 rounded-lg shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-lg font-medium">Paid Invoices</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {summary?.paid_invoices ?? 0}
          </span>
          <span className="text-sm font-medium opacity-90">Invoices</span>
        </div>
      </div>
    </div>
  );
}
