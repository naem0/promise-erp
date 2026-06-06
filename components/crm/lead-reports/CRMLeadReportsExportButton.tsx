"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { getCRMLeadReports, CRMLeadReportsItem } from "@/apiServices/crmLeadReportsService";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface ExportCRMLeadReportsButtonProps {
  fileName?: string;
  data?: CRMLeadReportsItem[];
  page?: number;
  perPage?: number;
}

const HEADERS = [
  "#SL",
  "Consultant",
  "Course",
  "Branch",
  "Date",
  "Total Lead",
  "Assigned",
  "Contacted",
  "New",
  "Busy",
  "Interested",
  "Follow Up",
  "Enrolled",
  "Cancelled",
  "Not Received",
  "Call Rejected",
  "Progress",
];

function buildRows(data: CRMLeadReportsItem[], page: number = 1, perPage: number = data.length) {
  return data?.map((item, index) => [
    (page - 1) * perPage + (index + 1),
    item?.consultant_name || "N/A",
    item?.course_name || "N/A",
    item?.branch_name || "N/A",
    item?.date || "",
    item?.total_lead || 0,
    item?.total_assigned || 0,
    item?.contacted || 0,
    item?.new || 0,
    item?.busy || 0,
    item?.interested || 0,
    item?.follow_up || 0,
    item?.enrolled || 0,
    item?.lost || 0,
    item?.not_received || 0,
    item?.call_rejected || 0,
    item?.target_progress || "",
  ]);
}

export default function CRMLeadReportsExportButton({
  fileName = "crm-lead-reports",
  data: providedData,
  page = 1,
  perPage = 15,
}: ExportCRMLeadReportsButtonProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, startExporting] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const fetchAllData = async () => {
    let allData: CRMLeadReportsItem[] = [];
    let currentPage = 1;
    let lastPage = 1;
    let hasError = false;

    do {
      const params = {
        consultant_id: searchParams.get("consultant_id") || undefined,
        branch_id: searchParams.get("branch_id") || undefined,
        course_id: searchParams.get("course_id") || undefined,
        status: searchParams.get("status") || undefined,
        date_from: searchParams.get("date_from") || undefined,
        date_to: searchParams.get("date_to") || undefined,
        per_page: 100,
        page: currentPage,
      };

      try {
        const res = await getCRMLeadReports(params);
        if (res?.success) {
          allData = [...allData, ...(res?.data?.report_data || [])];
          lastPage = res?.data?.pagination?.last_page || 1;
        } else {
          hasError = true;
          break;
        }
      } catch (error: unknown) {
        hasError = true;
        break;
      }
      currentPage++;
    } while (currentPage <= lastPage);

    if (hasError && allData.length === 0) {
      toast.error("Failed to fetch data for export.");
    }

    return allData;
  };

  const getDataToExport = async () => {
    if (providedData && providedData.length > 0) {
      return providedData;
    }
    return await fetchAllData();
  };

  const exportCSV = () => {
    startExporting(async () => {
      const data = await getDataToExport();
      if (!data.length) return;

      const rows = buildRows(data, providedData ? page : 1, providedData ? perPage : data.length);
      const csvContent = [HEADERS, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      triggerDownload(blob, `${fileName}.csv`);
      setOpen(false);
    });
  };

  const exportExcel = () => {
    startExporting(async () => {
      const data = await getDataToExport();
      if (!data.length) return;

      const { utils, writeFile } = await import("xlsx");
      const rows = buildRows(data, providedData ? page : 1, providedData ? perPage : data.length);
      const wsData = [HEADERS, ...rows];
      const ws = utils.aoa_to_sheet(wsData);

      ws["!cols"] = [
        { wch: 5 },  // SL
        { wch: 20 }, // Consultant
        { wch: 30 }, // Course
        { wch: 15 }, // Branch
        { wch: 15 }, // Date
        { wch: 12 }, // Total Lead
        { wch: 10 }, // Assigned
        { wch: 10 }, // Contacted
        { wch: 10 }, // New
        { wch: 10 }, // Busy
        { wch: 10 }, // Interested
        { wch: 10 }, // Follow Up
        { wch: 10 }, // Enrolled
        { wch: 10 }, // Cancelled
        { wch: 15 }, // Not Received
        { wch: 15 }, // Call Rejected
        { wch: 15 }, // Progress
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Leads Report");
      writeFile(wb, `${fileName}.xlsx`);
      setOpen(false);
    });
  };

  const exportPDF = () => {
    startExporting(async () => {
      const data = await getDataToExport();
      if (!data.length) return;

      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape" });

      const rows = buildRows(data, providedData ? page : 1, providedData ? perPage : data.length);
      autoTable(doc, {
        startY: 20,
        head: [HEADERS],
        body: rows.map((r) => r.map(String)),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 120, 200] },
      });

      doc.save(`${fileName}.pdf`);
      setOpen(false);
    });
  };

  const triggerDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            Exporting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Export <Download className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <Button
            onClick={exportCSV}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-none"
          >
            <FileText className="h-4 w-4" />
            Export as CSV
          </Button>

          <div className="border-t border-slate-100" />

          <Button
            onClick={exportExcel}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-none"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export as Excel
          </Button>

          <div className="border-t border-slate-100" />

          <Button
            onClick={exportPDF}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-none"
          >
            <File className="h-4 w-4" />
            Export as PDF
          </Button>
        </div>
      )}
    </div>
  );
}
