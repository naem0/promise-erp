"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { getCRMLeads, CRMLead } from "@/apiServices/crmLeadsService";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface ExportCRMLeadsButtonProps {
  fileName?: string;
  leads?: CRMLead[];
  page?: number;
  perPage?: number;
}

const HEADERS = [
  "#SL",
  "Name",
  "Phone",
  "Email",
  "Referrer Name",
  "Referrer Phone",
  "Course",
  "Type",
  "Shift",
  "Status",
  "Source",
  "Category",
  "Branch",
  "Counsellor",
  "Notes",
];

function buildRows(data: CRMLead[], page: number = 1, perPage: number = data.length) {
  return data.map((item, index) => [
    (page - 1) * perPage + (index + 1),
    item?.name || "N/A",
    item?.phone || "",
    item?.email || "",
    item?.referrer_name || "",
    item?.referrer_phone || "",
    item?.course?.name || item?.course_name || "",
    item?.course_type_text || "",
    item?.shift_text || "",
    item?.status_text || "",
    item?.source_text || "",
    item?.category?.name || "",
    item?.branch?.name || "",
    item?.assigned_consultant?.name || "",
    item?.notes || "",
  ]);
}

export default function CRMLeadsExportButton({
  fileName = "crm-leads",
  leads: providedLeads,
  page = 1,
  perPage = 15,
}: ExportCRMLeadsButtonProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, startExporting] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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

  const fetchAllLeads = async () => {
    let allLeads: CRMLead[] = [];
    let currentPage = 1;
    let lastPage = 1;
    let hasError = false;

    do {
      const params = {
        search: searchParams.get("search") || undefined,
        sort_order: searchParams.get("sort_order") || undefined,
        status: searchParams.get("status") || undefined,
        source: searchParams.get("source") || undefined,
        course_type: searchParams.get("course_type") || undefined,
        branch_id: searchParams.get("branch_id") || undefined,
        category_id: searchParams.get("category_id") || undefined,
        per_page: 100, // Fetch in chunks of 100 to bypass backend limits
        page: currentPage,
      };

      try {
        const res = await getCRMLeads(params);
        if (res?.success) {
          allLeads = [...allLeads, ...(res?.data?.leads || [])];
          lastPage = res?.data?.pagination?.last_page || 1;
        } else {
          console.error(res?.message || "Failed to fetch leads for export.");
          hasError = true;
          break;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message || "An error occurred while fetching leads.");
        } else {
          console.error("An unknown error occurred while fetching leads.");
        }
        hasError = true;
        break;
      }
      currentPage++;
    } while (currentPage <= lastPage);

    if (hasError && allLeads.length === 0) {
      toast.error("Failed to fetch leads for export.");
    }

    return allLeads;
  };

  const getLeadsToExport = async () => {
    if (providedLeads && providedLeads.length > 0) {
      return providedLeads;
    }
    return await fetchAllLeads();
  };

  // ── CSV ──────────────────────────────────────────────────────────────────
  const exportCSV = () => {
    startExporting(async () => {
      const leads = await getLeadsToExport();
      if (!leads.length) return;

      const rows = buildRows(leads, providedLeads ? page : 1, providedLeads ? perPage : leads.length);
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

  // ── Excel ─────────────────────────────────────────────────────────────────
  const exportExcel = () => {
    startExporting(async () => {
      const leads = await getLeadsToExport();
      if (!leads.length) return;

      const { utils, writeFile } = await import("xlsx");
      const rows = buildRows(leads, providedLeads ? page : 1, providedLeads ? perPage : leads.length);
      const wsData = [HEADERS, ...rows];
      const ws = utils.aoa_to_sheet(wsData);

      // Column widths
      ws["!cols"] = [
        { wch: 5 },  // SL
        { wch: 20 }, // Name
        { wch: 15 }, // Phone
        { wch: 20 }, // Email
        { wch: 15 }, // Referrer Name
        { wch: 15 }, // Referrer Phone
        { wch: 25 }, // Course
        { wch: 10 }, // Type
        { wch: 10 }, // Shift
        { wch: 10 }, // Status
        { wch: 10 }, // Source
        { wch: 15 }, // Category
        { wch: 15 }, // Branch
        { wch: 15 }, // Counsellor
        { wch: 30 }, // Notes
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "CRM Leads");
      writeFile(wb, `${fileName}.xlsx`);
      setOpen(false);
    });
  };

  // ── PDF ───────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    startExporting(async () => {
      const leads = await getLeadsToExport();
      if (!leads.length) return;

      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape" });

      try {
        // Load HindSiliguri font for full English and Bangla support
        const fontUrl = "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Regular.ttf";
        const fontRes = await fetch(fontUrl);
        if (fontRes.ok) {
          const buffer = await fontRes.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const fontBase64 = window.btoa(binary);
          doc.addFileToVFS("HindSiliguri.ttf", fontBase64);
          doc.addFont("HindSiliguri.ttf", "HindSiliguri", "normal");
          doc.setFont("HindSiliguri");
        }
      } catch (e) {
        console.error("Could not load Bangla font for PDF", e);
      }

      // Title
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("CRM Leads Report", 14, 16);

      // Sub-title (date)
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

      const rows = buildRows(leads, providedLeads ? page : 1, providedLeads ? perPage : leads.length);
      autoTable(doc, {
        startY: 28,
        head: [HEADERS],
        body: rows.map((r) => r.map(String)),
        styles: { 
          font: doc.getFont().fontName === "HindSiliguri" ? "HindSiliguri" : "helvetica", 
          fontSize: 7, 
          cellPadding: 2 
        },
        headStyles: {
          fillColor: [30, 120, 200],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 247, 252] },
        margin: { left: 10, right: 10 },
      });

      doc.save(`${fileName}.pdf`);
      setOpen(false);
    });
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
          {/* CSV */}
          <Button
            onClick={exportCSV}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary hover:bg-secondary/90 transition-colors rounded-none"
          >
            <FileText className="h-4 w-4 text-white" />
            Export as CSV
          </Button>

          <div className="border-t border-secondary-foreground/10" />

          {/* Excel */}
          <Button
            onClick={exportExcel}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary hover:bg-secondary/90 transition-colors rounded-none"
          >
            <FileSpreadsheet className="h-4 w-4 text-white" />
            Export as Excel
          </Button>

          <div className="border-t border-secondary-foreground/10" />

          {/* PDF */}
          <Button
            onClick={exportPDF}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white bg-secondary hover:bg-secondary/90 transition-colors rounded-none"
          >
            <File className="h-4 w-4 text-white" />
            Export as PDF
          </Button>
        </div>
      )}
    </div>
  );
}
