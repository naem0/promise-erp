"use client";

import { ArrowLeft, Printer, Download } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ChallanPageHeaderProps {
  backHref: string;
  onPrint: () => void;
  onExport: () => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanPageHeader({
  backHref,
  onPrint,
  onExport,
}: ChallanPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left — Back + Title */}
      <div className="flex items-center gap-3">
        <Link href={backHref}>
          <button
            type="button"
            aria-label="Go back"
            className="h-8 w-8 rounded-full bg-[#15803d] hover:bg-[#166534] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800 leading-none">
          Delivery Challan
        </h1>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Print */}
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4 text-slate-500" />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
