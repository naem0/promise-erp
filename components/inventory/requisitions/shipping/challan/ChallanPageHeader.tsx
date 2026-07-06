"use client";

import { ArrowLeft, Printer, Download } from "lucide-react";
import Link from "next/link";

interface ChallanPageHeaderProps {
  onPrint: () => void;
  onExport: () => void;
}

export default function ChallanPageHeader({
  onPrint,
  onExport,
}: ChallanPageHeaderProps) {
  return (
    <div className="challan-action-bar flex items-center justify-between gap-3 print:hidden">
      {/* Left — Back + Title */}
      <div className="flex items-center gap-3">
        <Link href={`/inventory/delivery`}>
          <button
            type="button"
            aria-label="Go back"
            className="h-8 w-8 rounded-full cursor-pointer bg-[#15803d] hover:bg-[#166534] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800 leading-none">
          Delivery Challan
        </h1>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Print */}
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm"
        >
          <Printer className="h-4 w-4 text-slate-500 shrink-0" />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-lg bg-[#15803d] hover:bg-[#166534] active:scale-95 text-white text-sm font-medium transition-all shadow-sm"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
