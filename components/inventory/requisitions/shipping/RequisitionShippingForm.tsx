"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DeliveryInformationPanel, {
  DeliveryFormValues,
} from "./DeliveryInformationPanel";
import DeliveryDetailsPanel from "./DeliveryDetailsPanel";
import { createDelivery } from "@/apiServices/inventoryDeliveriesService";

interface RequisitionShippingFormProps {
  initialRequisitions: any[];
  deliveryPartners: any[];
  employees: any[];
}

const DEFAULT_FORM: DeliveryFormValues = {
  deliveryType: "Courier", // Default to Courier as shown in Figma
  deliveredBy: "",
  deliveryPartnerId: "",
  status: "3", // Default to Shipped (3)
  deliveryCost: "",
  description: "",
  invoiceFile: null,
};

export default function RequisitionShippingForm({
  initialRequisitions,
  deliveryPartners,
  employees,
}: RequisitionShippingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [formValues, setFormValues] = useState<DeliveryFormValues>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the requisitions state with checked and deliver_qty fields
  const [requisitions, setRequisitions] = useState<any[]>(() => {
    return initialRequisitions.map((req) => ({
      ...req,
      items: (req.requested_items || []).map((item: any) => ({
        ...item,
        checked: true, // Checked by default
        deliver_qty: item.remaining_qty, // Defaults to full remaining quantity
      })),
    }));
  });

  const handleFormChange = (updated: Partial<DeliveryFormValues>) => {
    setFormValues((prev) => ({ ...prev, ...updated }));
  };

  const handleItemCheckToggle = (reqNo: string, itemId: number) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.requisition_no !== reqNo) return req;
        return {
          ...req,
          items: req.items.map((item: any) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const handleItemQtyChange = (reqNo: string, itemId: number, newQty: number) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.requisition_no !== reqNo) return req;
        return {
          ...req,
          items: req.items.map((item: any) => {
            if (item.id !== itemId) return item;
            // Bound quantity between 1 and remaining_qty
            const bounded = Math.max(1, Math.min(item.remaining_qty, newQty));
            return { ...item, deliver_qty: bounded };
          }),
        };
      })
    );
  };

  const handleSelectAllCard = (reqNo: string, checked: boolean) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.requisition_no !== reqNo) return req;
        return {
          ...req,
          items: req.items.map((item: any) => ({ ...item, checked })),
        };
      })
    );
  };

  const handleRemoveRequisition = (reqNo: string) => {
    setRequisitions((prev) => prev.filter((r) => r.requisition_no !== reqNo));
  };

  const handleDelivery = async () => {
    if (!formValues.deliveryType) {
      toast.error("Please select a delivery type.");
      return;
    }

    // Resolve delivery credentials based on type
    let deliveredByUserId = formValues.deliveredBy;
    let partnerId = formValues.deliveryPartnerId;

    if (formValues.deliveryType === "Courier") {
      if (!partnerId) {
        toast.error("Please select a courier partner under 'Delivered Via'.");
        return;
      }
      // Courier requires employee (delivered_by) to be the current logged-in user
      if (session?.user?.id) {
        deliveredByUserId = session.user.id;
      } else {
        toast.error("Session expired. Please log in again.");
        return;
      }
    } else {
      // In-house types (Physical, Transport, Air) require an employee select
      if (!deliveredByUserId) {
        toast.error("Please select an employee under 'Delivered Via'.");
        return;
      }
      partnerId = ""; // No courier partner
    }

    // Gather active requisitions (requisitions with at least one checked item)
    const activeReqs = requisitions.filter((req) =>
      req.items.some((item: any) => item.checked && item.deliver_qty > 0)
    );

    if (activeReqs.length === 0) {
      toast.error("Please select at least one item to ship.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append general fields
      formData.append("delivery_type", formValues.deliveryType);
      if (partnerId) {
        formData.append("delivery_partner_id", String(partnerId));
      }
      formData.append("delivered_by", String(deliveredByUserId));
      formData.append("status", formValues.status || "3"); // 3 = Shipped
      if (formValues.deliveryCost) {
        formData.append("delivery_cost", String(formValues.deliveryCost));
      }
      if (formValues.description) {
        formData.append("description", formValues.description);
      }
      if (formValues.invoiceFile) {
        formData.append("attachments[]", formValues.invoiceFile);
      }

      // Append requisition IDs
      activeReqs.forEach((req) => {
        if (req.requisition_id) {
          formData.append("requisition_ids[]", String(req.requisition_id));
        }
      });

      // Append items details (item_ids[] and deliver_qtys[])
      activeReqs.forEach((req) => {
        req.items.forEach((item: any) => {
          if (item.checked && item.deliver_qty > 0) {
            formData.append("item_ids[]", String(item.id));
            formData.append("deliver_qtys[]", String(item.deliver_qty));
          }
        });
      });

      const response = await createDelivery(formData);
      
      if (response && (response.success || response.code === 201 || response.code === 200)) {
        toast.success("Shipment processed successfully!");
        router.push(`/inventory/delivery/${response.data?.invoice?.invoice_no}/challan`);
        router.refresh();
      } else {
        if (response?.errors) {
          const errorKeys = Object.keys(response.errors);
          if (errorKeys.length > 0) {
            const firstKey = errorKeys[0];
            const firstError = response.errors[firstKey];
            const errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
            toast.error(errorMsg || "Validation failed.");
            setIsSubmitting(false);
            return;
          }
        }
        toast.error(response?.message || "Failed to process shipment.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process shipment.");
    } finally {
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
            aria-label="Back to deliveries"
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
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left — Delivery Information */}
        <div className="lg:sticky lg:top-4">
          <DeliveryInformationPanel
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleDelivery}
            isSubmitting={isSubmitting}
            deliveryPartners={deliveryPartners}
            employees={employees}
          />
        </div>

        {/* Right — Delivery Details */}
        <DeliveryDetailsPanel
          requisitions={requisitions}
          onRemove={handleRemoveRequisition}
          onItemCheckToggle={handleItemCheckToggle}
          onItemQtyChange={handleItemQtyChange}
          onSelectAllCard={handleSelectAllCard}
        />
      </div>
    </div>
  );
}
