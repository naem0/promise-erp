"use client";

import { BranchSummary } from "@/apiServices/inventoryreportService";
import { Button } from "@/components/ui/button";
import { Printer, Download, Building, MapPin, DoorClosed, Package, CircleDollarSign } from "lucide-react";

interface InventoryReportSummaryProps {
  summary?: BranchSummary;
}

export default function InventoryReportSummary({ summary }: InventoryReportSummaryProps) {
  if (!summary) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality (e.g. print dialog or CSV trigger)
    window.print();
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 print:shadow-none print:border-slate-300 print:p-4 print:space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600 print:hidden" />
            {summary?.branch_name} Inventory
          </h2>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Package className="w-4 h-4 text-emerald-600 print:hidden" />
              Total Items: <strong className="text-slate-900">{summary?.total_items}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <CircleDollarSign className="w-4 h-4 text-emerald-600 print:hidden" />
              Value: <strong className="text-slate-900">৳{summary?.valuation}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400 print:hidden" />
              Region: <span className="font-medium text-slate-700">{summary?.region || "N/A"}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <DoorClosed className="w-4 h-4 text-slate-400 print:hidden" />
              Rooms: <span className="font-medium text-slate-700">{summary?.rooms_count}</span>
            </span>
          </div>
          {summary?.address && (
            <p className="text-xs text-slate-600 mt-1.5 italic">
              {summary?.address}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-950 text-white"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
