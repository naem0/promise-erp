"use client";

import React, { useRef, useState } from "react";
import {
  Truck,
  Wrench,
  AlertTriangle,
  ArrowLeftRight,
  CloudUpload,
  X,
  FileText,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryPartner } from "@/apiServices/inventoryDeliveryPartnersService";
import { Employee } from "@/apiServices/employeeService";
import { Controller, Control, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type DeliveryType = "Courier" | "Physical" | "Transport" | "Air";

export interface DeliveryFormValues {
  deliveryType: DeliveryType | "";
  deliveredBy: number | string;
  deliveryPartnerId: number | string;
  status: string;
  deliveryCost: string;
  description: string;
  invoiceFile: File | null;
}

interface DeliveryInformationPanelProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  isSubmitting: boolean;
  deliveryPartners: DeliveryPartner[];
  employees: Employee[];
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
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 w-full cursor-pointer
        ${
          selected
            ? "bg-[#eafaf1] border-[#008738] text-[#008738] shadow-sm font-semibold"
            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }`}
    >
      <span
        className={`shrink-0 ${selected ? "text-[#008738]" : "text-slate-400"}`}
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
          <div className="text-[#008738] bg-green-50 p-2 rounded-lg shrink-0">
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
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md cursor-pointer"
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
          className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150
            ${dragging ? "border-[#008738] bg-green-50/50" : "border-slate-200 bg-slate-50/30 hover:border-slate-300"}`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="bg-slate-100 rounded-full p-3 mb-1">
            <CloudUpload className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-500 text-center">
            Drag and drop your file here or{" "}
            <span className="text-[#2563eb] font-semibold hover:underline">
              Browse
            </span>
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
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
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
  { label: "Physical", icon: <Wrench className="h-4 w-4" /> },
  { label: "Transport", icon: <AlertTriangle className="h-4 w-4" /> },
  { label: "Air", icon: <ArrowLeftRight className="h-4 w-4" /> },
];

export default function DeliveryInformationPanel({
  control,
  register,
  watch,
  setValue,
  isSubmitting,
  deliveryPartners,
  employees,
}: DeliveryInformationPanelProps) {
  const deliveryType = watch("deliveryType");
  const isCourier = deliveryType === "Courier";

  const handleTypeClick = (type: DeliveryType) => {
    setValue("deliveryType", type);
    setValue("deliveredBy", "");
    setValue("deliveryPartnerId", "");
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="bg-[#eafaf1] text-[#008738] p-2.5 rounded-xl border border-[#d2f4e1]">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          Delivery Information
        </h2>
      </div>

      {/* ── Form Body ── */}
      <div className="p-6 space-y-6">
        {/* Delivery Type */}
        <div>
          <FieldLabel>Delivery Type</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            {DELIVERY_TYPES.map(({ label, icon }) => (
              <DeliveryTypeOption
                key={label}
                label={label}
                icon={icon}
                selected={deliveryType === label}
                onClick={() => handleTypeClick(label)}
              />
            ))}
          </div>
        </div>

        {/* Delivered Via */}
        <div>
          <FieldLabel>Delivered Via</FieldLabel>
          <div className="relative">
            {isCourier ? (
              <select
                {...register("deliveryPartnerId")}
                className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#008738]/10 focus:border-[#008738] transition-colors cursor-pointer"
              >
                <option value="">Select</option>
                {deliveryPartners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                {...register("deliveredBy")}
                className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#008738]/10 focus:border-[#008738] transition-colors cursor-pointer"
              >
                <option value="">Select</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            )}
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
              {...register("status")}
              className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#008738]/10 focus:border-[#008738] transition-colors cursor-pointer"
            >
              <option value="">Select</option>
              <option value="2">In Transit</option>
              <option value="3">Shipped</option>
              <option value="4">Return</option>
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
            placeholder="e.g: 2000 TK"
            {...register("deliveryCost")}
            className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#008738]/10 focus:border-[#008738] transition-colors placeholder:text-slate-300"
          />
        </div>

        {/* Upload Invoice/Bill/Voucher */}
        <div>
          <FieldLabel>Upload Invoice/Bill/Voucher</FieldLabel>
          <Controller
            control={control}
            name="invoiceFile"
            render={({ field }) => (
              <FileUploadArea
                file={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Shipped Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#008738] hover:bg-[#00702f] text-white px-6 py-5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Truck className="h-4 w-4 text-white" />
            {isSubmitting ? "Processing..." : "Shipped"}
          </Button>
        </div>
      </div>
    </div>
  );
}
