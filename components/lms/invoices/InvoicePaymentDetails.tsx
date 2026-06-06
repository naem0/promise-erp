import { InvoiceDetailData } from "@/apiServices/invoiceService";
import React from "react";

interface InvoicePaymentDetailsProps {
  payment: InvoiceDetailData;
}

export function InvoicePaymentDetails({ payment }: InvoicePaymentDetailsProps) {
  return (
    <div className="bg-white rounded-xl border p-6 lg:col-span-7 space-y-3 print-card">
      <h3 className="text-base font-bold text-black mb-4 pb-2 border-b border-gray-100">
        Payment Details
      </h3>

      <div className="flex justify-between items-center p-3 rounded-lg bg-[#e8f3ef] text-primary font-medium text-sm">
        <span>Course Fee</span>
        <span className="font-bold">
          ৳ {payment.original_price ?? 0}
        </span>
      </div>

      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 text-gray-700 text-sm">
        <span>Discount</span>
        <span className="font-medium">
          ৳ {payment?.discount_amount ?? 0}
        </span>
      </div>

      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 text-gray-700 text-sm">
        <span>Coupon Use</span>
        <span className="font-medium">
          ৳ {payment?.coupon_discount ?? 0}
        </span>
      </div>

      <div className="flex justify-between items-center p-3 rounded-lg bg-[#fef3c7] text-primary font-medium text-sm">
        <span>Total Payment</span>
        <span className="font-bold">
          ৳ {payment?.final_price ?? 0}
        </span>
      </div>

      <div className="flex justify-between items-center p-3 rounded-lg bg-[#eff6ff] text-secondary font-medium text-sm">
        <span>Paid </span>
        <span className="font-bold">
          ৳ {payment?.payment_amount ?? 0}
        </span>
      </div>

      <div className="flex justify-between items-center p-3 rounded-lg bg-[#fee2e2] text-red-700 font-medium text-sm">
        <span>Due</span>
        <span className="font-bold">
          ৳ {payment?.due_amount ?? 0}
        </span>
      </div>
    </div>
  );
}
