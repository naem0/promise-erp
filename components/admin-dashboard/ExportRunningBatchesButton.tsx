"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { RunningBatch } from "@/apiServices/adminDashboardService";

interface ExportRunningBatchesButtonProps {
  runningBatches: RunningBatch[];
  fileName?: string;
}

const HEADERS = [
  "#SL",
  "Course",
  "Batch",
  "Start Date",
  "End Date",
  "Total Students",
  "Present Today",
];

function buildRows(data: RunningBatch[]) {
  return data.map((item, index) => [
    index + 1,
    item?.course,
    item?.batch,
    item?.start_date,
    item?.end_date,
    item?.total_students,
    item?.present_today,
  ]);
}

export default function ExportRunningBatchesButton({
  runningBatches,
  fileName = "running-batches",
}: ExportRunningBatchesButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  // ── CSV ──────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = buildRows(runningBatches);
    const csvContent = [HEADERS, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `${fileName}.csv`);
    setOpen(false);
  };

  // ── Excel ─────────────────────────────────────────────────────────────────
  const exportExcel = async () => {
    const { utils, writeFile } = await import("xlsx");
    const rows = buildRows(runningBatches);
    const wsData = [HEADERS, ...rows];
    const ws = utils.aoa_to_sheet(wsData);

    // Column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 15 },
    ];

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Running Batches");
    writeFile(wb, `${fileName}.xlsx`);
    setOpen(false);
  };

  // ── PDF ───────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Running Batches Report", 14, 16);

    // Sub-title (date)
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    const rows = buildRows(runningBatches);
    autoTable(doc, {
      startY: 28,
      head: [HEADERS],
      body: rows.map((r) => r.map(String)),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [30, 120, 200],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 247, 252] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`${fileName}.pdf`);
    setOpen(false);
  };

  // ── Download helper ───────────────────────────────────────────────────────
  const triggerDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative" ref={menuRef}>
      <Button
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        Export <Download className="ml-2 h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* CSV */}
          <Button
            onClick={exportCSV}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary transition-colors"
          >
            <FileText className="h-4 w-4 text-white" />
            Export as CSV
          </Button>

          <div className="mx-3 border-t" />

          {/* Excel */}
          <Button
            onClick={exportExcel}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-white" />
            Export as Excel
          </Button>

          <div className="mx-3 border-t" />

          {/* PDF */}
          <Button
            onClick={exportPDF}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary transition-colors"
          >
            <File className="h-4 w-4 text-white" />
            Export as PDF
          </Button>
        </div>
      )}
    </div>
  );
}
