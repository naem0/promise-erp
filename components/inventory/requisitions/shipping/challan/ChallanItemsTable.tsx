"use client";

import React from "react";

export interface ChallanItem {
  name: string;
  quantity: number;
  unit?: string;
}

export interface GroupedChallanRequisition {
  requisition_no: string;
  user_name: string;
  items: {
    product_name: string;
    quantity: number;
  }[];
}

interface ChallanItemsTableProps {
  items: ChallanItem[];
  groupedItems?: GroupedChallanRequisition[];
  isMultiple: boolean;
  totalQuantity: string;
  deliveryCost: string;
  qrValue?: string;
}

export default function ChallanItemsTable({
  items,
  groupedItems,
  isMultiple,
  totalQuantity,
  deliveryCost,
  qrValue,
}: ChallanItemsTableProps) {
  const hasGrouped = isMultiple && groupedItems && groupedItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-slate-200">
          {/* Head */}
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="border border-slate-200 w-12 sm:w-16 px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                SI
              </th>
              <th className="border border-slate-200 px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="border border-slate-200 w-24 sm:w-36 px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {hasGrouped ? (
              // Grouped table layout for multiple invoices
              groupedItems.map((group, groupIdx) => (
                <React.Fragment key={group.requisition_no}>
                  {/* Group Header Row */}
                  <tr className="bg-slate-50">
                    <td
                      colSpan={3}
                      className="border border-slate-200 px-4 py-2.5 font-bold text-slate-700 text-left text-xs sm:text-sm"
                    >
                      {String(groupIdx + 1).padStart(2, "0")}. REQ ID: {group.requisition_no}
                      {group.user_name ? ` | User: ${group.user_name}` : ""}
                    </td>
                  </tr>

                  {/* Group Items */}
                  {group.items.map((item, itemIdx) => (
                    <tr key={`${group.requisition_no}-${itemIdx}`} className="bg-white hover:bg-slate-50/30 transition-colors">
                      <td className="border border-slate-200 px-4 py-2.5 text-slate-400 font-medium text-center tabular-nums">
                        {String(itemIdx + 1).padStart(2, "0")}
                      </td>
                      <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-medium text-left">
                        {item.product_name}
                      </td>
                      <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-medium text-center tabular-nums">
                        {String(item.quantity).padStart(2, "0")}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              // Flat table layout for a single invoice
              items.map((item, idx) => (
                <tr key={idx} className="bg-white hover:bg-slate-50/30 transition-colors">
                  <td className="border border-slate-200 px-4 py-2.5 text-slate-400 font-medium text-center tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-medium text-left">
                    {item.name}
                  </td>
                  <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-medium text-center tabular-nums">
                    {String(item.quantity).padStart(2, "0")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer row — QR + Totals */}
      <div className="flex flex-row items-start justify-between gap-4 pt-2">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          {qrValue ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(qrValue)}`}
              alt="QR Code"
              width={72}
              height={72}
              className="rounded border border-slate-100"
            />
          ) : (
            <div className="w-[72px] h-[72px] bg-slate-100 rounded flex items-center justify-center text-slate-300 text-[10px]">
              QR
            </div>
          )}
          <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
            Scan For Details
          </p>
        </div>

        {/* Summary Totals Table */}
        <div className="w-full sm:w-auto min-w-[220px] sm:min-w-[280px]">
          <table className="w-full text-sm border-collapse border border-slate-200">
            <tbody>
              <tr>
                <td className="border border-slate-200 px-4 py-2.5 text-slate-500 font-bold text-left bg-slate-50/50">
                  Total Quantity
                </td>
                <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-semibold text-center min-w-[80px] sm:min-w-[100px] tabular-nums">
                  {totalQuantity}Pcs
                </td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-2.5 text-slate-500 font-bold text-left bg-slate-50/50">
                  Delivery Cost
                </td>
                <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-semibold text-center min-w-[80px] sm:min-w-[100px] tabular-nums">
                  {deliveryCost}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
