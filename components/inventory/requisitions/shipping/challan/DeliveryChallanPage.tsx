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
import { DeliveryInvoiceData } from "@/apiServices/inventoryBrandsService";

function formatNow(): string {
  const now = new Date();
  const date = now
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  const time = now
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(":", ".");
  return `${date}, ${time}`;
}

function printChallanElement(el: HTMLElement) {
  // Collect every <link rel="stylesheet"> href from the current page
  const cssLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
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
interface DeliveryChallanPageProps {
  invoiceData: DeliveryInvoiceData;
}

export default function DeliveryChallanPage({
  invoiceData,
}: DeliveryChallanPageProps) {
  const challanRef = useRef<HTMLDivElement>(null);
  const qrValue = invoiceData.scan_url || "#";

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

  // Map invoiceData to Challan components format
  const meta: ChallanMetaRowData = {
    reqId: invoiceData.req_id,
    challanNo: invoiceData.challan_no,
    challanDate: invoiceData.challan_date,
    deliveryDate: invoiceData.delivery_date,
  };

  const address: ChallanAddressData = {
    fromName: invoiceData.delivered_from.name,
    fromPhone: invoiceData.delivered_from.phone,
    fromWebsite: invoiceData.delivered_from.website,
    fromAddress: invoiceData.delivered_from.address,
    fromBin: invoiceData.delivered_from.bin_no,
    toName: invoiceData.delivered_to.name,
    toBranch: invoiceData.delivered_to.branch,
    toPhone: invoiceData.delivered_to.phone,
  };

  const items: ChallanItem[] = invoiceData.items.map((item) => ({
    name: item.product_name,
    quantity: item.quantity,
  }));

  const totalQuantity = String(invoiceData.total_quantity);
  const deliveryCost = invoiceData.delivery_cost
    ? `${invoiceData.delivery_cost} TK`
    : "0 TK";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── Top Action Bar ── */}
      <ChallanPageHeader
        onPrint={handlePrint}
        onExport={handleExport}
      />
      <div
        ref={challanRef}
        id="challan-print-root"
        className="
          bg-white border border-slate-100 rounded-2xl shadow-sm
          p-4 sm:p-6 lg:p-8
          space-y-5
        "
      >
        <ChallanCompanyInfo challanNumber={meta.challanNo} />
        <ChallanMetaRow data={meta} />
        <ChallanAddressSection data={address} />
        <div className="border-t border-slate-200" />
        <ChallanItemsTable
          items={items}
          totalQuantity={totalQuantity}
          deliveryCost={deliveryCost}
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
