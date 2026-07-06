"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, User, CalendarDays, FileText, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeliveryDetailData } from "@/apiServices/inventoryBrandsService";

interface DeliveryDetailsPageProps {
  data: DeliveryDetailData;
}

export default function DeliveryDetailsPage({ data }: DeliveryDetailsPageProps) {
  // Status text styling for the invoice info section
  const getStatusBadgeStyle = (statusText?: string) => {
    const status = String(statusText).toLowerCase();
    switch (status) {
      case "received":
      case "recieved":
      case "delivered":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50";
      case "shipped":
      case "delivering":
        return "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-50";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50";
      case "returned":
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100 hover:bg-red-50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50";
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6">
      {/* Top Header Actions */}
      <div className="flex items-center gap-4">
        <Link href="/inventory/delivery">
          <Button
            size="icon"
            className="h-9 w-9 cursor-pointer rounded-full bg-[#15803d] hover:bg-[#166534] text-white flex items-center justify-center border-none shadow-none transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          {data.requisition_no}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Top 3 Meta Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Branch Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="text-[#15803d] mt-1 bg-green-50/50 p-2.5 rounded-lg border border-green-100/30">
              <Building2 className="h-5 w-5 stroke-[2.25]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Branch
              </span>
              <span className="text-sm font-bold text-slate-700">
                {data.delivery_branch || "—"}
              </span>
            </div>
          </div>

          {/* Applicant Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="text-[#15803d] mt-1 bg-green-50/50 p-2.5 rounded-lg border border-green-100/30">
              <User className="h-5 w-5 stroke-[2.25]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Applicant
              </span>
              <div className="text-sm font-bold text-slate-700 space-y-0.5">
                <div>Name : {data.applicant?.name || "—"}</div>
                <div className="text-slate-400 font-semibold text-xs mt-0.5">
                  Mob: {data.applicant?.mob || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Expected Date Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="text-[#15803d] mt-1 bg-green-50/50 p-2.5 rounded-lg border border-green-100/30">
              <CalendarDays className="h-5 w-5 stroke-[2.25]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Expected Date
              </span>
              <span className="text-sm font-bold text-slate-700">
                {data.expected_date || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout split: Left (Items + Invoice) and Right (Approval Timeline) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Block */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requested Items Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Requested Items
                </h2>
              </div>

              {/* Items Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="w-16 font-bold text-slate-500 py-3 px-4 text-center">SI</TableHead>
                      <TableHead className="font-bold text-slate-500 py-3 px-4 text-left">Product Name</TableHead>
                      <TableHead className="font-bold text-slate-500 py-3 px-4 text-center">Request Quantity</TableHead>
                      <TableHead className="font-bold text-slate-500 py-3 px-4 text-center">Stock Qty</TableHead>
                      <TableHead className="font-bold text-slate-500 py-3 px-4 text-center">Approved Qty</TableHead>
                      <TableHead className="font-bold text-slate-500 py-3 px-4 text-center">After Delivery Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.requested_items && data?.requested_items?.length > 0 ? (
                      data?.requested_items?.map((item, index) => (
                        <TableRow key={item.id || index} className="border-slate-100 hover:bg-slate-50/20">
                          <TableCell className="py-3 px-4 text-center font-medium text-slate-500">
                            {String(index + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-left font-semibold text-slate-700">
                            {item.product_name || "—"}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center font-medium text-slate-600">
                            {item.request_quantity || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center font-medium text-slate-600">
                            {item.stock_qty || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center font-medium text-slate-600">
                            {item.approved_qty || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center font-medium text-slate-600">
                            {item.after_delivery_qty || 0}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="py-6 text-center text-slate-400">
                          No requested items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Invoice Info Horizontal Card */}
            {data.invoice && (
              <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-emerald-600 mt-1 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100/30 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 stroke-[2.25]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm font-bold text-slate-700">
                      Invoice : {data.invoice.invoice_no || "—"}
                    </div>
                    {/* Delimited details string */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-400">
                      <span>Branch: <span className="text-slate-600 font-bold">{data.invoice.branch || "—"}</span></span>
                      <span className="text-slate-300">|</span>
                      <span>Applicant: <span className="text-slate-600 font-bold">{data.invoice.applicant || "—"}</span></span>
                      <span className="text-slate-300">|</span>
                      <span>Total Item : <span className="text-slate-600 font-bold">{data.invoice.total_item || 0}Pcs</span></span>
                      <span className="text-slate-300">|</span>
                      <span>Delivery Type: <span className="text-slate-600 font-bold">{data.invoice.delivery_type || "—"}</span></span>
                      <span className="text-slate-300">|</span>
                      <span>Delivery By: <span className="text-slate-600 font-bold">{data.invoice.delivery_by || "—"}</span></span>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1">
                        <span>Status:</span>
                        <Badge variant="outline" className={`rounded-full px-2.5 py-0.25 font-bold text-[10px] uppercase shadow-none border ${getStatusBadgeStyle(data.invoice.status_text)}`}>
                          {data.invoice.status_text || "—"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side PDF attachment link/icon */}
                {data.invoice.attachment ? (
                  <Link
                    href={data.invoice.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 flex items-center justify-center shrink-0"
                    title="View Attachment PDF"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                ) : (
                  <div className="p-2 text-slate-300 border border-slate-50 rounded-lg flex items-center justify-center shrink-0 cursor-not-allowed">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Block (Timeline) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800">
                Approval Dashboard
              </h2>

              {/* Timeline Container */}
              <div className="relative pl-1">
                {data?.approval_dashboard && data?.approval_dashboard?.length > 0 ? (
                  data?.approval_dashboard?.map((step, index) => {
                    // const isApproved = step.status?.toLowerCase() === "approved" || step.status?.toLowerCase() === "completed" || step.status?.toLowerCase() === "pending";
                    // Note: Figma screenshot shows checkmarks for all listed items with green cards, so let's style them as success timeline items.

                    return (
                      <div key={index} className="relative flex gap-4 pb-6 last:pb-2">
                        {/* Connector Line */}
                        {index < data.approval_dashboard.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-emerald-600/30" />
                        )}

                        {/* Circle Check Icon */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-white bg-[#15803d] shrink-0 shadow-sm border-2 border-white">
                          <Check className="w-4 h-4 stroke-3" />
                        </div>

                        {/* Step Card */}
                        <div className="flex-1 bg-[#f2fcf5] border border-[#e1f7e7] rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#15803d]">
                              {step.role_name || "—"}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500">
                              {step.date_time || "—"}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              <span className="font-bold">Note : </span>
                              {step.note || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    No approval steps available.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Final Overall Status Banner */}
            <div className="w-full bg-[#15803d] text-white font-bold text-center py-3 rounded-lg text-sm shadow-sm select-none uppercase tracking-wider mt-6">
              {data.invoice?.status_text || "Completed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
