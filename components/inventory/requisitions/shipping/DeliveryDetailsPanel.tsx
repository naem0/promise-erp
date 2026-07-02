"use client";

import React, { useState } from "react";
import { Search, Trash2, Package } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SelectedRequisition {
  id: number;
  challanNo: string;
  branch: string;
  applicant: string;
  aspectDate: string;
  items: { name: string; quantity: number }[];
}

interface DeliveryDetailsPanelProps {
  requisitions: SelectedRequisition[];
  onRemove: (id: number) => void;
  onDraft: () => void;
  onDelivery: () => void;
  isSubmitting: boolean;
}

// ─────────────────────────────────────────────
// Serial Badge
// ─────────────────────────────────────────────
function SerialBadge({ index }: { index: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#15803d] text-white text-xs font-bold shrink-0">
      #{String(index + 1).padStart(2, "0")}
    </span>
  );
}

// ─────────────────────────────────────────────
// Requisition Card
// ─────────────────────────────────────────────
interface RequisitionCardProps {
  req: SelectedRequisition;
  index: number;
  onRemove: (id: number) => void;
}

function RequisitionCard({ req, index, onRemove }: RequisitionCardProps) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <SerialBadge index={index} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {req.challanNo}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              Branch: {req.branch} &nbsp;|&nbsp; Applicant: {req.applicant}
              &nbsp;|&nbsp; Aspect Date: {req.aspectDate}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(req.id)}
          className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 shrink-0"
          aria-label="Remove requisition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Products */}
      <div className="px-4 py-3 space-y-2">
        {/* Column headers */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span>Product Details</span>
          <span>Quantity</span>
        </div>

        {/* Product rows */}
        {req.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex-1 border border-slate-100 rounded-lg px-3 py-2 bg-white text-sm text-slate-700 font-medium">
              {item.name}
            </div>
            <div className="w-14 border border-slate-100 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 text-center bg-white shrink-0">
              {item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-slate-50 rounded-full p-4 mb-3">
        <Package className="h-8 w-8 text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-400">
        No requisitions selected
      </p>
      <p className="text-xs text-slate-300 mt-1">
        Search and add requisitions above
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────
export default function DeliveryDetailsPanel({
  requisitions,
  onRemove,
  onDraft,
  onDelivery,
  isSubmitting,
}: DeliveryDetailsPanelProps) {
  const [search, setSearch] = useState("");

  const totalItems = requisitions.reduce(
    (sum, req) => sum + req.items.length,
    0
  );

  const filtered = search.trim()
    ? requisitions.filter((r) =>
        r.challanNo.toLowerCase().includes(search.toLowerCase())
      )
    : requisitions;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-green-50 text-[#15803d] p-2 rounded-lg">
            <Package className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Delivery Details
          </h2>
        </div>
        {requisitions.length > 0 && (
          <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
            {String(requisitions.length).padStart(2, "0")} Item
            {requisitions.length !== 1 ? "s" : ""} Selected
          </span>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="px-5 py-3 border-b border-slate-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Requisition id for delivery"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* ── Requisition List ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((req, index) => (
            <RequisitionCard
              key={req.id}
              req={req}
              index={index}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Items
          </p>
          <p className="text-xl font-bold text-slate-800 leading-tight">
            {String(requisitions.length).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDraft}
            disabled={isSubmitting}
            className="px-5 h-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={onDelivery}
            disabled={isSubmitting || requisitions.length === 0}
            className="px-5 h-9 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Shipment Process"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Export helper type for parent use
// ─────────────────────────────────────────────
export type { SelectedRequisition };
