"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { getCRMLeadReports, CRMLeadReportsConsultantItem } from "@/apiServices/crmLeadReportsService";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface ExportCRMLeadReportsButtonProps {
  fileName?: string;
  data?: CRMLeadReportsConsultantItem[];
  page?: number;
  perPage?: number;
}

const HEADERS = [
  "#SL",
  "Consultant",
  "Course",
  "Branch",
  "Leads (T)",
  "Leads (A)",
  "Assigned (N)",
  "Assigned (F)",
  "Assigned (W)",
  "Assigned (O)",
  "Contacted (N)",
  "Contacted (F)",
  "Contacted (W)",
  "Contacted (O)",
  "Remaining (N)",
  "Remaining (F)",
  "Busy (N)",
  "Busy (F)",
  "Busy (O)",
  "Interested (N)",
  "Interested (W)",
  "Interested (O)",
  "Follow Up (N)",
  "Follow Up (W)",
  "Follow Up (O)",
  "Enrolled (N)",
  "Enrolled (W)",
  "Enrolled (O)",
  "Cancelled (N)",
  "Cancelled (W)",
  "Cancelled (O)",
  "Not Received (N)",
  "Not Received (W)",
  "Not Received (O)",
  "Call Rejected (N)",
  "Call Rejected (W)",
  "Call Rejected (O)",
  "Progress",
];

const PDF_HEADERS = [
  "#SL",
  "Consultant",
  "Course Name",
  "Branch",
  "L-T", "L-A",
  "As-N", "As-F", "As-W", "As-O",
  "Co-N", "Co-F", "Co-W", "Co-O",
  "Re-N", "Re-F",
  "Bu-N", "Bu-F", "Bu-O",
  "In-N", "In-W", "In-O",
  "Fo-N", "Fo-W", "Fo-O",
  "En-N", "En-W", "En-O",
  "Ca-N", "Ca-W", "Ca-O",
  "NR-N", "NR-W", "NR-O",
  "CR-N", "CR-W", "CR-O",
  "Progress",
];

function buildRows(data: CRMLeadReportsConsultantItem[], page: number = 1, perPage: number = data.length) {
  const rows: any[][] = [];
  
  data?.forEach((item, index) => {
    const serial = (page - 1) * perPage + (index + 1);
    const consultantName = item?.consultant_name || "N/A";
    
    // For each course of this consultant
    item.courses?.forEach((course, courseIndex) => {
      rows.push([
        serial,
        consultantName,
        course.course_name || "N/A",
        item.branch?.[courseIndex]?.branch_name || item.branch?.[0]?.branch_name || "",
        course.leads?.["total-leads"] ?? 0,
        course.leads?.["available-leads"] ?? 0,
        course.assigned?.new ?? 0,
        course.assigned?.followup ?? 0,
        course.assigned?.working ?? 0,
        course.assigned?.old ?? 0,
        course.contacted?.new ?? 0,
        course.contacted?.followup ?? 0,
        course.contacted?.working ?? 0,
        course.contacted?.old ?? 0,
        course.remaining?.new ?? 0,
        course.remaining?.followup ?? 0,
        course.busy?.new ?? 0,
        course.busy?.followup ?? 0,
        course.busy?.old ?? 0,
        course.interested?.new ?? 0,
        course.interested?.working ?? 0,
        course.interested?.old ?? 0,
        course.follow_up?.new ?? 0,
        course.follow_up?.working ?? 0,
        course.follow_up?.old ?? 0,
        course.enrolled?.new ?? 0,
        course.enrolled?.working ?? 0,
        course.enrolled?.old ?? 0,
        course.cancelled?.new ?? 0,
        course.cancelled?.working ?? 0,
        course.cancelled?.old ?? 0,
        course.not_received?.new ?? 0,
        course.not_received?.working ?? 0,
        course.not_received?.old ?? 0,
        course.call_rejected?.new ?? 0,
        course.call_rejected?.working ?? 0,
        course.call_rejected?.old ?? 0,
        course.target_progress || "",
      ]);
    });
    
    // Also add the consultant total row
    rows.push([
      `Total [${consultantName}]`,
      consultantName,
      "Total",
      "", // Branch empty
      item.total?.leads?.["total-leads"] ?? 0,
      item.total?.leads?.["available-leads"] ?? 0,
      item.total?.assigned?.new ?? 0,
      item.total?.assigned?.followup ?? 0,
      item.total?.assigned?.working ?? 0,
      item.total?.assigned?.old ?? 0,
      item.total?.contacted?.new ?? 0,
      item.total?.contacted?.followup ?? 0,
      item.total?.contacted?.working ?? 0,
      item.total?.contacted?.old ?? 0,
      item.total?.remaining?.new ?? 0,
      item.total?.remaining?.followup ?? 0,
      item.total?.busy?.new ?? 0,
      item.total?.busy?.followup ?? 0,
      item.total?.busy?.old ?? 0,
      item.total?.interested?.new ?? 0,
      item.total?.interested?.working ?? 0,
      item.total?.interested?.old ?? 0,
      item.total?.follow_up?.new ?? 0,
      item.total?.follow_up?.working ?? 0,
      item.total?.follow_up?.old ?? 0,
      item.total?.enrolled?.new ?? 0,
      item.total?.enrolled?.working ?? 0,
      item.total?.enrolled?.old ?? 0,
      item.total?.cancelled?.new ?? 0,
      item.total?.cancelled?.working ?? 0,
      item.total?.cancelled?.old ?? 0,
      item.total?.not_received?.new ?? 0,
      item.total?.not_received?.working ?? 0,
      item.total?.not_received?.old ?? 0,
      item.total?.call_rejected?.new ?? 0,
      item.total?.call_rejected?.working ?? 0,
      item.total?.call_rejected?.old ?? 0,
      item.total?.target_progress || "",
    ]);
  });
  
  return rows;
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
    let allData: CRMLeadReportsConsultantItem[] = [];
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
        { wch: 15 }, // SL
        { wch: 20 }, // Consultant
        { wch: 30 }, // Course
        { wch: 15 }, // Branch
        // 2 Leads
        { wch: 10 }, { wch: 10 },
        // 4 Assigned
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 4 Contacted
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 2 Remaining
        { wch: 10 }, { wch: 10 },
        // 3 Busy
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Interested
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Follow Up
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Enrolled
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Cancelled
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Not Received
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // 3 Call Rejected
        { wch: 10 }, { wch: 10 }, { wch: 10 },
        // Progress
        { wch: 15 },
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
      
      const columnStyles: Record<number, { cellWidth: number }> = {
        0: { cellWidth: 8 },  // SL
        1: { cellWidth: 25 }, // Consultant
        2: { cellWidth: 35 }, // Course
        3: { cellWidth: 15 }, // Branch
      };
      for (let i = 4; i <= 36; i++) {
        columnStyles[i] = { cellWidth: 5.5 };
      }
      columnStyles[37] = { cellWidth: 12.5 }; // Progress

      autoTable(doc, {
        startY: 15,
        head: [PDF_HEADERS],
        body: rows.map((r) => r.map(String)),
        styles: { 
          fontSize: 5,
          cellPadding: 1,
          valign: 'middle',
          halign: 'center',
          overflow: 'linebreak'
        },
        columnStyles: columnStyles,
        headStyles: { 
          fillColor: [30, 120, 200],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 5
        },
        didParseCell: function(cellData) {
          if (cellData.column.index === 1 || cellData.column.index === 2) {
            cellData.cell.styles.halign = 'left';
          }
        }
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
