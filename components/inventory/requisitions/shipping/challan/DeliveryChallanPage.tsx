"use client";

import React, { useCallback, useRef } from "react";
import ChallanPageHeader from "./ChallanPageHeader";
import ChallanCompanyInfo from "./ChallanCompanyInfo";
import ChallanMetaRow, { ChallanMetaRowData } from "./ChallanMetaRow";
import ChallanAddressSection, {
  ChallanAddressData,
} from "./ChallanAddressSection";
import ChallanItemsTable, { ChallanItem } from "./ChallanItemsTable";
import ChallanFooter from "./ChallanFooter";

// ─────────────────────────────────────────────
// Mock Data — replace with real API response
// ─────────────────────────────────────────────
const MOCK_META: ChallanMetaRowData = {
  reqId: "REQ-2023-2026",
  challanNo: "EL-C-0001",
  challanDate: "01-07-2026",
  deliveryDate: "05-07-2026",
};

const MOCK_ADDRESS: ChallanAddressData = {
  fromName: "e-Learning & Earning Ltd.",
  fromCompany: "090000000000",
  fromPhone: "090000000000",
  fromWebsite: "www.e-learnt.com",
  fromAddress:
    "Khaja Super Market, 2nd to 7th Floor, Kallyanpur Bus Stop, Mirpur Road, Dhaka-1207.",
  fromBin: "5066046406406",
  toName: "Rahman Khandokar",
  toBranch: "Cumilla Branch",
  toPhone: "+880171717171",
};

const MOCK_ITEMS: ChallanItem[] = [
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
  { name: "A4 Paper", quantity: 8 },
];

const MOCK_TOTAL_QUANTITY = "200Pcs";
const MOCK_DELIVERY_COST = "2000 TK";

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function formatNow(): string {
  const now = new Date();
  const date = now
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
}

// ─────────────────────────────────────────────
// Print helper — opens a clean popup window with
// only the challan content so the admin layout
// never interferes with the print output.
// ─────────────────────────────────────────────
function printChallanElement(el: HTMLElement) {
  // Collect every <link rel="stylesheet"> href from the current page
  const cssLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  )
    .map((l) => `<link rel="stylesheet" href="${l.href}" />`)
    .join("\n");

  // Collect any inline <style> tags (e.g. Tailwind's generated CSS)
  const inlineStyles = Array.from(document.querySelectorAll("style"))
    .map((s) => `<style>${s.textContent ?? ""}</style>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Delivery Challan</title>
  ${cssLinks}
  ${inlineStyles}
  <style>
    /* ── Print-window base styles ── */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: white;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    img {
      max-width: 100%;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      image-rendering: crisp-edges;
    }
    @page { margin: 14mm; size: A4 portrait; }
  </style>
</head>
<body>
  ${el.outerHTML}
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
  if (!win) {
    // Popup was blocked — fall back to full-page print
    window.print();
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();

  // Wait for external stylesheets & images to load, then print
  win.addEventListener("load", () => {
    win.print();
    // Give user time to interact with print dialog before closing
    win.addEventListener("afterprint", () => win.close());
  });
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface DeliveryChallanPageProps {
  requisitionId: number;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function DeliveryChallanPage({
  requisitionId,
}: DeliveryChallanPageProps) {
  const challanRef = useRef<HTMLDivElement>(null);
  const backHref = `/inventory/requisitions/${requisitionId}/shipping`;
  const qrValue = `${typeof window !== "undefined" ? window.location.origin : ""}/inventory/requisitions/${requisitionId}/shipping/challan`;

  const handlePrint = useCallback(() => {
    if (challanRef.current) {
      printChallanElement(challanRef.current);
    }
  }, []);

  // Export = print to PDF (user can choose "Save as PDF" in print dialog)
  const handleExport = useCallback(() => {
    if (challanRef.current) {
      printChallanElement(challanRef.current);
    }
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── Top Action Bar ── */}
      <ChallanPageHeader
        backHref={backHref}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      {/* ── Challan Document ── */}
      <div
        ref={challanRef}
        id="challan-print-root"
        className="
          bg-white border border-slate-100 rounded-2xl shadow-sm
          p-4 sm:p-6 lg:p-8
          space-y-5
        "
      >
        {/* 1. Company info + Challan number */}
        <ChallanCompanyInfo challanNumber={MOCK_META.challanNo} />

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* 2. Meta row — Req ID, Challan No, Dates */}
        <ChallanMetaRow data={MOCK_META} />

        {/* 3. Address section — Delivered From / To */}
        <ChallanAddressSection data={MOCK_ADDRESS} />

        {/* 4. Items table + QR + Totals */}
        <ChallanItemsTable
          items={MOCK_ITEMS}
          totalQuantity={MOCK_TOTAL_QUANTITY}
          deliveryCost={MOCK_DELIVERY_COST}
          qrValue={qrValue}
        />

        {/* 5. Footer */}
        <ChallanFooter
          generatedAt={formatNow()}
          systemName="E-Learning & Earning Expense Management System"
        />
      </div>
    </div>
  );
}
