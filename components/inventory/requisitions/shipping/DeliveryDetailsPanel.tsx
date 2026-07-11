"use client";

import React from "react";
import { UserPlus, ClipboardList } from "lucide-react";

interface SelectedItem {
  id: number;
  product_name: string;
  request_quantity: number;
  stock_qty: number;
  approved_qty: number;
  delivered_qty: number;
  remaining_qty: number;
  checked: boolean;
  deliver_qty: number;
}

interface SelectedRequisition {
  requisition_id: number;
  requisition_no: string;
  delivery_branch?: string | null;
  applicant: {
    name: string;
    mob?: string | null;
  };
  expected_date?: string | null;
  items: SelectedItem[];
}

interface DeliveryDetailsPanelProps {
  requisitions: SelectedRequisition[];
  onRemove: (reqNo: string) => void;
  onItemCheckToggle: (reqNo: string, itemId: number) => void;
  onItemQtyChange: (reqNo: string, itemId: number, qty: number) => void;
  onSelectAllCard: (reqNo: string, checked: boolean) => void;
}

// ─────────────────────────────────────────────
// Serial Badge
// ─────────────────────────────────────────────
function SerialBadge({ index }: { index: number }) {
  return (
    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#eafaf1] border border-[#d2f4e1] text-[#008738] text-xs font-bold shrink-0">
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
  onItemCheckToggle: (reqNo: string, itemId: number) => void;
  onItemQtyChange: (reqNo: string, itemId: number, qty: number) => void;
  onSelectAllCard: (reqNo: string, checked: boolean) => void;
}

function RequisitionCard({
  req,
  index,
  onItemCheckToggle,
  onItemQtyChange,
  onSelectAllCard,
}: RequisitionCardProps) {
  const allChecked = req.items.every((item) => item.checked);

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm p-6 space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SerialBadge index={index} />
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {req.requisition_no}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Branch: {req.delivery_branch || "N/A"} &nbsp;|&nbsp; Applicant: {req.applicant?.name || "N/A"}
              &nbsp;|&nbsp; Aspect Date: {req.expected_date || "N/A"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelectAllCard(req.requisition_no, !allChecked)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#008738] transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-100 font-medium"
        >
          <UserPlus className="h-3.5 w-3.5 text-[#008738]" />
          Select All
        </button>
      </div>

      {/* Products Column Headers */}
      <div className="grid grid-cols-[auto_1fr_100px_130px] gap-4 items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pt-2">
        <div className="w-5"></div> {/* Checkbox placeholder */}
        <div>Product Details</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Deliver Quantity</div>
      </div>

      {/* Product Rows */}
      <div className="space-y-3">
        {req.items.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-[auto_1fr_100px_130px] gap-4 items-center transition-opacity ${!item.checked ? "opacity-60" : ""}`}
          >
            {/* Checkbox */}
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onItemCheckToggle(req.requisition_no, item.id)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-[#008738] focus:ring-[#008738]/20 cursor-pointer accent-[#008738]"
              />
            </div>

            {/* Product Name */}
            <div className="border border-slate-100 rounded-xl px-4 py-3 bg-[#fbfbfb] text-sm text-slate-700 font-medium truncate">
              {item.product_name}
            </div>

            {/* Quantity */}
            <div className="border border-slate-100 rounded-xl py-3 text-sm font-semibold text-slate-600 text-center bg-[#fbfbfb]">
              {item.remaining_qty}
            </div>

            {/* Deliver Quantity (plus/minus controls) */}
            <div className="flex justify-center">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden w-[110px] justify-between">
                <button
                  type="button"
                  onClick={() => onItemQtyChange(req.requisition_no, item.id, item.deliver_qty - 1)}
                  disabled={!item.checked || item.deliver_qty <= 1}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold select-none text-base transition-colors"
                >
                  &minus;
                </button>
                <div className="text-sm font-semibold text-slate-700 select-none">
                  {item.deliver_qty}
                </div>
                <button
                  type="button"
                  onClick={() => onItemQtyChange(req.requisition_no, item.id, item.deliver_qty + 1)}
                  disabled={!item.checked || item.deliver_qty >= item.remaining_qty}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer font-bold select-none text-base transition-colors"
                >
                  &#43;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────
export default function DeliveryDetailsPanel({
  requisitions,
  onItemCheckToggle,
  onItemQtyChange,
  onSelectAllCard,
}: DeliveryDetailsPanelProps) {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-[#eafaf1] text-[#008738] p-2.5 rounded-xl border border-[#d2f4e1]">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Delivery Details
          </h2>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-full">
          {String(requisitions.length).padStart(2, "0")} ItemSelected
        </span>
      </div>

      {/* ── Requisition Cards List ── */}
      <div className="space-y-5">
        {requisitions.map((req, index) => (
          <RequisitionCard
            key={req.requisition_no}
            req={req}
            index={index}
            onItemCheckToggle={onItemCheckToggle}
            onItemQtyChange={onItemQtyChange}
            onSelectAllCard={onSelectAllCard}
          />
        ))}
      </div>
    </div>
  );
}
