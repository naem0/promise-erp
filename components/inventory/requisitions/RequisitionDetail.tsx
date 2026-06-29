"use client";

import React from "react";
import { Requisition, requisitionRequestApproval } from "@/apiServices/requisitionsService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Download } from "lucide-react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import RequisitionDetailSummary from "./RequisitionDetailSummary";
import ApprovalHierarchyList from "./ApprovalHierarchyList";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RequisitionDetailProps {
  requisition: Requisition;
}

interface FormValues {
  items: Array<{
    selected: boolean;
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    stock_qty: number;
    approved_qty: number;
    after_delivery_qty: number;
    reason_for_requirement: string;
  }>;
  amount_items: Array<{
    selected: boolean;
    id: number;
    amount_requested: number;
    approved_amount: number;
    amount_reason: string;
    amount_expected_date: string;
  }>;
  note: string;
}

export default function RequisitionDetail({
  requisition,
}: RequisitionDetailProps) {
  const router = useRouter();

  const hasItems = requisition?.items && requisition.items.length > 0;
  const hasAmountItems = requisition?.amount_items && requisition.amount_items.length > 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      items:
        requisition?.items?.map((item) => ({
          selected: false,
          id: item?.id,
          product_name: item?.product_name || "",
          price: item?.price || 0,
          quantity: item?.quantity || 0,
          stock_qty: item?.stock_qty || 0,
          approved_qty: item?.approved_qty || 0,
          after_delivery_qty: item?.after_delivery_qty || 0,
          reason_for_requirement: item?.reason_for_requirement || "",
        })) || [],
      amount_items:
        requisition?.amount_items?.map((item) => ({
          selected: false,
          id: item?.id,
          amount_requested: item?.amount_requested || 0,
          approved_amount: item?.approved_amount || 0,
          amount_reason: item?.amount_reason || "",
          amount_expected_date: item?.amount_expected_date || "",
        })) || [],
      note: "",
    },
  });

  const watchedItems = watch("items") || [];
  const watchedAmountItems = watch("amount_items") || [];

  const itemsAllSelected =
    watchedItems.length > 0 && watchedItems.every((item) => item.selected);
  const amountItemsAllSelected =
    watchedAmountItems.length > 0 && watchedAmountItems.every((item) => item.selected);

  const isAnySelected =
    watchedItems.some((item) => item.selected) ||
    watchedAmountItems.some((item) => item.selected);

  const handleItemsSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    watchedItems.forEach((_, idx) => {
      setValue(`items.${idx}.selected`, checked);
    });
  };

  const handleAmountItemsSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    watchedAmountItems.forEach((_, idx) => {
      setValue(`amount_items.${idx}.selected`, checked);
    });
  };

  const onSubmit = async (data: FormValues, action: "Approve" | "Reject") => {
    const selectedProductItems = data.items
      .filter((item) => item.selected)
      .map((item) => ({
        id: item.id,
        approved_qty: item.approved_qty,
        price: item.price,
      }));

    const selectedAmountItems = data.amount_items
      .filter((item) => item.selected)
      .map((item) => ({
        id: item.id,
        approved_qty: item.approved_amount, // Map approved_amount to approved_qty for approval action API structure
        price: 0,
      }));

    const selectedItems = [...selectedProductItems, ...selectedAmountItems];

    if (selectedItems.length === 0) {
      toast.error("Please select at least one item.");
      return;
    }

    // Check if any selected item has approved quantity/amount < 1
    const hasInvalidQty = selectedItems.some((item) => (item.approved_qty ?? 0) < 1);
    if (hasInvalidQty) {
      toast.error("Approved Quantity/Amount cannot be less than 1 for selected items.");
      return;
    }

    try {
      const res = await requisitionRequestApproval(requisition.id, {
        items: selectedItems,
        action: action,
        note: data.note,
      });

      if (res?.success) {
        toast.success(res.message || `Requisition successfully ${action.toLowerCase()}d.`);
        router.refresh();
      } else {
        toast.error(res?.message || "Operation failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <RequisitionDetailSummary requisition={requisition} />
      {/* ─── Main Content: Items + Approval Dashboard ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Requested Items
              </h2>
              {(hasItems || hasAmountItems) && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    // onClick={() => window.print()}
                    className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-medium px-4 py-2 h-9 rounded-lg gap-2 flex items-center"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button className="bg-indigo-900 hover:bg-indigo-950 text-white font-medium px-4 py-2 h-9 rounded-lg gap-2 flex items-center shadow-sm">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            {!hasItems && !hasAmountItems ? (
              <div className="text-center py-12 text-slate-500 font-medium border border-slate-100 rounded-xl bg-slate-50/20">
                No data found.
              </div>
            ) : (
              <>
                {/* ─── Item-Based Table ─── */}
                {hasItems && (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[100px] font-semibold text-secondary">
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={itemsAllSelected}
                                onChange={handleItemsSelectAllChange}
                                className="h-4 w-4 rounded border-gray-300 text-[#15803d] focus:ring-[#15803d] cursor-pointer bg-white"
                              />
                              <span>SL</span>
                            </span>
                          </TableHead>
                          <TableHead className="font-semibold text-secondary">
                            Product Name
                          </TableHead>
                          <TableHead className="font-semibold text-secondary">
                            Price
                          </TableHead>
                          <TableHead className="text-center font-semibold text-secondary">
                            Request Qty
                          </TableHead>
                          <TableHead className="text-center font-semibold text-secondary">
                            Stock Qty
                          </TableHead>
                          <TableHead className="text-center font-semibold text-secondary">
                            Approved Qty
                          </TableHead>
                          <TableHead className="text-center font-semibold text-secondary">
                            After Delivery Qty
                          </TableHead>
                          <TableHead className="text-center font-semibold text-secondary">
                            Reason
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {watchedItems.map((item, index) => {
                          const approved = Number(item.approved_qty) || 1;
                          const calculatedAfterDelivery = item.stock_qty - approved;
                          return (
                            <TableRow
                              key={item?.id || index}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <TableCell className="text-center text-slate-500 font-medium py-3.5">
                                <span className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    {...register(`items.${index}.selected`)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#15803d] focus:ring-[#15803d] cursor-pointer bg-white"
                                  />
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </TableCell>
                              <TableCell className="font-medium text-secondary py-3.5">
                                {item?.product_name}
                              </TableCell>
                              <TableCell className="font-medium text-secondary py-3.5">
                                {item?.price}
                              </TableCell>
                              <TableCell className="text-center font-medium text-secondary py-3.5">
                                {item?.quantity}
                              </TableCell>
                              <TableCell className="text-center font-medium text-secondary py-3.5">
                                {item?.stock_qty}
                              </TableCell>
                              <TableCell className="text-center font-medium text-secondary py-3.5">
                                <input
                                  type="number"
                                  min={1}
                                  {...register(`items.${index}.approved_qty`, {
                                    valueAsNumber: true,
                                  })}
                                  className="w-16 text-center border border-slate-200 rounded px-1.5 py-0.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-300 mx-auto block"
                                />
                              </TableCell>
                              <TableCell className="text-center font-medium text-secondary py-3.5">
                                {calculatedAfterDelivery}
                              </TableCell>
                              <TableCell className="text-center py-3.5">
                                {item?.reason_for_requirement ?? "---"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* ─── Amount-Based Table ─── */}
                {hasAmountItems && (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[100px] font-semibold text-secondary">
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={amountItemsAllSelected}
                                onChange={handleAmountItemsSelectAllChange}
                                className="h-4 w-4 rounded border-gray-300 text-[#15803d] focus:ring-[#15803d] cursor-pointer bg-white"
                              />
                              <span>SL</span>
                            </span>
                          </TableHead>
                          <TableHead className="font-semibold text-secondary">
                            Amount Request
                          </TableHead>
                          <TableHead className="font-semibold text-secondary">
                            Approve Amount
                          </TableHead>
                          <TableHead className="font-semibold text-secondary">
                            Reason
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {watchedAmountItems.map((item, index) => (
                          <TableRow
                            key={item?.id || index}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="text-center text-slate-500 font-medium py-3.5">
                              <span className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  {...register(`amount_items.${index}.selected`)}
                                  className="h-4 w-4 rounded border-gray-300 text-[#15803d] focus:ring-[#15803d] cursor-pointer bg-white"
                                />
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-secondary py-3.5">
                              ৳ {item?.amount_requested}
                            </TableCell>
                            <TableCell className="font-medium text-secondary py-3.5">
                              <span className="flex items-center gap-1.5">
                                <span>৳</span>
                                <input
                                  type="number"
                                  min={1}
                                  {...register(`amount_items.${index}.approved_amount`, {
                                    valueAsNumber: true,
                                  })}
                                  className="w-20 text-center border border-slate-200 rounded px-1.5 py-0.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-300 block bg-white"
                                />
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium py-3.5">
                              {item?.amount_reason || "------"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {/* Note & Bulk Actions */}
            {(hasItems || hasAmountItems) && (
              <PermissionGuard requiredPermission="requisition-approve">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800">
                      Note
                    </label>
                    <textarea
                      placeholder="Type Note"
                      {...register("note")}
                      className="w-full min-h-[82px] border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      disabled={!isAnySelected || isSubmitting}
                      onClick={handleSubmit((data) => onSubmit(data, "Reject"))}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-2 h-9 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Reject"}
                    </Button>
                    <Button
                      type="button"
                      disabled={!isAnySelected || isSubmitting}
                      onClick={handleSubmit((data) => onSubmit(data, "Approve"))}
                      className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 h-9 rounded-lg gap-2 flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Approve"}
                    </Button>
                  </div>
                </form>
              </PermissionGuard>
            )}
          </div>
        </div>

        {/* Right: Approval Dashboard */}
        <div className="xl:col-span-1 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Approval Dashboard
          </h2>
          <ApprovalHierarchyList requisition={requisition} />
        </div>
      </div>
    </div>
  );
}
