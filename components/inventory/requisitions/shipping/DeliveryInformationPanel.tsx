"use client";

import React, { useRef, useState } from "react";
import {
  Truck,
  Package,
  Navigation,
  Wind,
  CloudUpload,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type DeliveryType = "Courier" | "Physical" | "Transport" | "Air";

export interface DeliveryFormValues {
  deliveryType: DeliveryType | "";
  deliveredBy: string;
  status: string;
  deliveryCost: string;
  description: string;
  invoiceFile: File | null;
}

interface DeliveryInformationPanelProps {
  values: DeliveryFormValues;
  onChange: (updated: Partial<DeliveryFormValues>) => void;
  onDraft: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// ─────────────────────────────────────────────
// Delivery Type Option
// ─────────────────────────────────────────────
interface DeliveryTypeOptionProps {
  label: DeliveryType;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function DeliveryTypeOption({
  label,
  icon,
  selected,
  onClick,
}: DeliveryTypeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 w-full
        ${
          selected
            ? "bg-green-50 border-[#15803d] text-[#15803d] shadow-sm"
            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }`}
    >
      <span
        className={`shrink-0 ${selected ? "text-[#15803d]" : "text-slate-400"}`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────
// File Upload Area
// ─────────────────────────────────────────────
interface FileUploadAreaProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

function FileUploadArea({ file, onChange }: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onChange(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {file ? (
        /* ── File preview ── */
        <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50">
          <div className="text-[#15803d] bg-green-50 p-2 rounded-lg shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150
            ${dragging ? "border-[#15803d] bg-green-50/50" : "border-slate-200 bg-slate-50/50 hover:border-slate-300"}`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="bg-white rounded-full p-3 shadow-sm border border-slate-100">
            <CloudUpload className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 text-center">
            Drag and drop your file here or{" "}
            <span className="text-[#15803d] font-semibold cursor-pointer hover:underline">
              Browse
            </span>
          </p>
          <p className="text-xs text-slate-400">
            Supports PDF, DOC, DOCX, Images
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Field Label
// ─────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────
const DELIVERY_TYPES: {
  label: DeliveryType;
  icon: React.ReactNode;
}[] = [
  { label: "Courier", icon: <Truck className="h-4 w-4" /> },
  { label: "Physical", icon: <Package className="h-4 w-4" /> },
  { label: "Transport", icon: <Navigation className="h-4 w-4" /> },
  { label: "Air", icon: <Wind className="h-4 w-4" /> },
];

const STATUS_OPTIONS = ["Pending", "In Transit", "Delivered", "Failed"];
const DELIVERED_BY_OPTIONS = [
  "Pathao",
  "Sundarban Courier",
  "SA Paribahan",
  "Redx",
  "In-House",
];

export default function DeliveryInformationPanel({
  values,
  onChange,
  onDraft,
  onSubmit,
  isSubmitting,
}: DeliveryInformationPanelProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="bg-green-50 text-[#15803d] p-2 rounded-lg">
          <Truck className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">
          Delivery Information
        </h2>
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Delivery Type */}
        <div>
          <FieldLabel>Delivery Type</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {DELIVERY_TYPES.map(({ label, icon }) => (
              <DeliveryTypeOption
                key={label}
                label={label}
                icon={icon}
                selected={values.deliveryType === label}
                onClick={() => onChange({ deliveryType: label })}
              />
            ))}
          </div>
        </div>

        {/* Delivered By */}
        <div>
          <FieldLabel>Delivered By</FieldLabel>
          <div className="relative">
            <select
              value={values.deliveredBy}
              onChange={(e) => onChange({ deliveredBy: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
            >
              <option value="">Select</option>
              {DELIVERED_BY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="relative">
            <select
              value={values.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors"
            >
              <option value="">Select</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Delivery Cost */}
        <div>
          <FieldLabel>Delivery Cost</FieldLabel>
          <input
            type="number"
            min={0}
            placeholder="e.g. 2000 TK"
            value={values.deliveryCost}
            onChange={(e) => onChange({ deliveryCost: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors placeholder:text-slate-300"
          />
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={4}
            placeholder="Type any description"
            value={values.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 focus:border-[#15803d] transition-colors placeholder:text-slate-300 resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <FieldLabel>Upload Invoice/Bill/Voucher</FieldLabel>
          <FileUploadArea
            file={values.invoiceFile}
            onChange={(file) => onChange({ invoiceFile: file })}
          />
        </div>
      </div>
    </div>
  );
}
