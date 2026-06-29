"use client";

import React from "react";
import ChallanPageHeader from "./ChallanPageHeader";
import ChallanCompanyInfo from "./ChallanCompanyInfo";
import ChallanInfoSection, { ChallanInfoData } from "./ChallanInfoSection";
import ChallanRequisitionCard, {
  ChallanRequisitionData,
} from "./ChallanRequisitionCard";
import ChallanFooter from "./ChallanFooter";

// ─────────────────────────────────────────────
// Mock Data — replace with real API response
// ─────────────────────────────────────────────
const MOCK_CHALLAN_INFO: ChallanInfoData = {
  deliveredByName: "Md. Karim Shah",
  contact: "01700000000",
  partner: "Sundorbon Courier Services Ltd.",
  description: "There are all glass item, please note this.",
};

const MOCK_REQUISITIONS: ChallanRequisitionData[] = [
  {
    id: 1,
    challanNo: "REQ-2506-2026",
    branch: "Cumilla",
    applicant: "Md. Riadus Salam",
    aspectDate: "01-07-2026",
    items: [
      { name: "A4 Paper", quantity: 1 },
      { name: "Power Supply", quantity: 1 },
      { name: "Corei 7th Gen PC", quantity: 1 },
    ],
  },
  {
    id: 2,
    challanNo: "REQ-2506-2026",
    branch: "Cumilla",
    applicant: "Md. Riadus Salam",
    aspectDate: "01-07-2026",
    items: [
      { name: "A4 Paper", quantity: 1 },
      { name: "Power Supply", quantity: 1 },
      { name: "Corei 7th Gen PC", quantity: 1 },
    ],
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatNow(): string {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-") +
    ", " +
    now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
  const backHref = `/inventory/requisitions/${requisitionId}/shipping`;

  const handlePrint = () => window.print();

  const handleExport = () => {
    // TODO: implement PDF export via API or jsPDF
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* ── Top Action Bar ── */}
      <ChallanPageHeader
        backHref={backHref}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      {/* ── Challan Document ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 print:shadow-none print:border-none print:rounded-none">
        {/* Company Info + Challan Number */}
        <ChallanCompanyInfo challanNumber="EL-C-0001" />

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Delivery Info + Delivery Details */}
        <ChallanInfoSection data={MOCK_CHALLAN_INFO} />

        {/* Requisition Cards */}
        <div className="space-y-4">
          {MOCK_REQUISITIONS.map((req, index) => (
            <ChallanRequisitionCard key={req.id} req={req} index={index} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Footer */}
        <ChallanFooter
          generatedAt={formatNow()}
          systemName="E-Learning & Earning Expense Management System"
        />
      </div>
    </div>
  );
}
