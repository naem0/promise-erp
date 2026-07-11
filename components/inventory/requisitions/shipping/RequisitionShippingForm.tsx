"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import DeliveryInformationPanel, {
  DeliveryType,
} from "./DeliveryInformationPanel";
import DeliveryDetailsPanel from "./DeliveryDetailsPanel";
import { createDelivery, RequisitionShippingDetail, ShippingItem } from "@/apiServices/inventoryDeliveriesService";
import { DeliveryPartner } from "@/apiServices/inventoryDeliveryPartnersService";
import { Employee } from "@/apiServices/employeeService";

interface ShippingItemWithState extends ShippingItem {
  checked: boolean;
  deliver_qty: number;
}

interface RequisitionWithItems extends RequisitionShippingDetail {
  items: ShippingItemWithState[];
}

export interface FormValues {
  deliveryType: DeliveryType | "";
  deliveredBy: number | string;
  deliveryPartnerId: number | string;
  status: string;
  deliveryCost: string;
  description: string;
  invoiceFile: File | null;
  requisitions: RequisitionWithItems[];
}

interface RequisitionShippingFormProps {
  initialRequisitions: RequisitionShippingDetail[];
  deliveryPartners: DeliveryPartner[];
  employees: Employee[];
}

export default function RequisitionShippingForm({
  initialRequisitions,
  deliveryPartners,
  employees,
}: RequisitionShippingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      deliveryType: "Courier",
      deliveredBy: "",
      deliveryPartnerId: "",
      status: "3",
      deliveryCost: "",
      description: "",
      invoiceFile: null,
      requisitions: initialRequisitions.map((req) => ({
        ...req,
        items: (req.requested_items || []).map((item) => ({
          ...item,
          checked: true,
          deliver_qty: item.remaining_qty,
        })),
      })),
    },
  });

  const requisitions = watch("requisitions");

  const handleItemCheckToggle = (reqNo: string, itemId: number) => {
    const updated = requisitions.map((req) => {
      if (req.requisition_no !== reqNo) return req;
      return {
        ...req,
        items: req.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      };
    });
    setValue("requisitions", updated, { shouldValidate: true });
  };

  const handleItemQtyChange = (reqNo: string, itemId: number, newQty: number) => {
    const updated = requisitions.map((req) => {
      if (req.requisition_no !== reqNo) return req;
      return {
        ...req,
        items: req.items.map((item) => {
          if (item.id !== itemId) return item;
          const bounded = Math.max(1, Math.min(item.remaining_qty, newQty));
          return { ...item, deliver_qty: bounded };
        }),
      };
    });
    setValue("requisitions", updated, { shouldValidate: true });
  };

  const handleSelectAllCard = (reqNo: string, checked: boolean) => {
    const updated = requisitions.map((req) => {
      if (req.requisition_no !== reqNo) return req;
      return {
        ...req,
        items: req.items.map((item) => ({ ...item, checked })),
      };
    });
    setValue("requisitions", updated, { shouldValidate: true });
  };

  const handleRemoveRequisition = (reqNo: string) => {
    const updated = requisitions.filter((r) => r.requisition_no !== reqNo);
    setValue("requisitions", updated, { shouldValidate: true });
  };

  const handleDelivery = async (values: FormValues) => {
    if (!values.deliveryType) {
      toast.error("Please select a delivery type.");
      return;
    }

    // Resolve delivery credentials based on type
    let deliveredByUserId = values.deliveredBy;
    let partnerId = values.deliveryPartnerId;

    if (values.deliveryType === "Courier") {
      if (!partnerId) {
        toast.error("Please select a courier partner under 'Delivered Via'.");
        return;
      }
      if (session?.user?.id) {
        deliveredByUserId = session.user.id;
      } else {
        toast.error("Session expired. Please log in again.");
        return;
      }
    } else {
      if (!deliveredByUserId) {
        toast.error("Please select an employee under 'Delivered Via'.");
        return;
      }
      partnerId = "";
    }

    const activeReqs = values.requisitions.filter((req) =>
      req.items.some((item) => item.checked && item.deliver_qty > 0)
    );

    if (activeReqs.length === 0) {
      toast.error("Please select at least one item to ship.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("delivery_type", values.deliveryType);
      if (partnerId) {
        formData.append("delivery_partner_id", String(partnerId));
      }
      formData.append("delivered_by", String(deliveredByUserId));
      formData.append("status", values.status || "3");
      if (values.deliveryCost) {
        formData.append("delivery_cost", String(values.deliveryCost));
      }
      if (values.description) {
        formData.append("description", values.description);
      }
      if (values.invoiceFile) {
        formData.append("attachments[]", values.invoiceFile);
      }

      activeReqs.forEach((req) => {
        if (req.requisition_id) {
          formData.append("requisition_ids[]", String(req.requisition_id));
        }
      });

      activeReqs.forEach((req) => {
        req.items.forEach((item) => {
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
            return;
          }
        }
        toast.error(response?.message || "Failed to process shipment.");
      }
    } catch (error: unknown) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "Failed to process shipment.";
      toast.error(errMsg);
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

      {/* ── Two-Panel Layout Form ── */}
      <form onSubmit={handleSubmit(handleDelivery)} className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left — Delivery Information */}
        <div className="lg:sticky lg:top-4">
          <DeliveryInformationPanel
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
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
      </form>
    </div>
  );
}
