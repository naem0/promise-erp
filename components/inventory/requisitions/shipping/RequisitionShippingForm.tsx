"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeliveryInformationPanel, {
  DeliveryFormValues,
} from "./DeliveryInformationPanel";
import DeliveryDetailsPanel, { SelectedRequisition } from "./DeliveryDetailsPanel";

// ─────────────────────────────────────────────
// Mock data — replace with real API data
// ─────────────────────────────────────────────
const MOCK_REQUISITIONS: SelectedRequisition[] = [
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
  {
    id: 3,
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
// Default form state
// ─────────────────────────────────────────────
const DEFAULT_FORM: DeliveryFormValues = {
  deliveryType: "",
  deliveredBy: "",
  status: "",
  deliveryCost: "",
  description: "",
  invoiceFile: null,
};

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface RequisitionShippingFormProps {
  requisitionId: number;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function RequisitionShippingForm({
  requisitionId,
}: RequisitionShippingFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<DeliveryFormValues>(DEFAULT_FORM);
  const [requisitions, setRequisitions] =
    useState<SelectedRequisition[]>(MOCK_REQUISITIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (updated: Partial<DeliveryFormValues>) => {
    setFormValues((prev) => ({ ...prev, ...updated }));
  };

  const handleRemoveRequisition = (id: number) => {
    setRequisitions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDraft = async () => {
    toast.info("Saved as draft.");
  };

  const handleDelivery = async () => {
    if (!formValues.deliveryType) {
      toast.error("Please select a delivery type.");
      return;
    }
    if (requisitions.length === 0) {
      toast.error("Please add at least one requisition.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Call real delivery API
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Shipment processed successfully!");
      router.push(`/inventory/delivery/${requisitionId}/challan`);
    } catch {
      toast.error("Failed to process shipment.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <Link href={`/inventory/delivery`}>
          <button
            type="button"
            className="h-8 w-8 cursor-pointer rounded-full bg-[#15803d] hover:bg-[#166534] text-white flex items-center justify-center transition-colors shadow-sm"
            aria-label="Back to requisition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 leading-none">
            Create Delivery
          </h1>
        </div>
      </div>

      {/* ── Two-Panel Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
        {/* Left — Delivery Information */}
        <div className="lg:sticky lg:top-4">
          <DeliveryInformationPanel
            values={formValues}
            onChange={handleFormChange}
            onDraft={handleDraft}
            onSubmit={handleDelivery}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right — Delivery Details */}
        <DeliveryDetailsPanel
          requisitions={requisitions}
          onRemove={handleRemoveRequisition}
          onDraft={handleDraft}
          onDelivery={handleDelivery}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
