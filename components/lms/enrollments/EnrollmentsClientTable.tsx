"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, X } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import EnrollmentActionMenu from "./EnrollmentActionMenu";
import BulkTransferModal from "./BulkTransferModal";
import { Enrollment } from "@/apiServices/enrollmentService";
import { PaginationType } from "@/types/pagination";
import { truncate } from "@/lib/utils";

interface EnrollmentsClientTableProps {
  enrollments: Enrollment[];
  paginationData?: PaginationType;
  page: number;
  perPage: number;
}

export default function EnrollmentsClientTable({
  enrollments,
  paginationData,
  page,
  perPage,
}: EnrollmentsClientTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const allIdsOnPage = enrollments.map((e) => e.id);
  const isAllSelected =
    allIdsOnPage.length > 0 &&
    allIdsOnPage.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIdsOnPage])));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatCurrency = (amount?: number | null) =>
    amount !== undefined && amount !== null
      ? `${Number(amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ৳`
      : "N/A";

  return (
    <>
      {/* Top Banner when items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50/80 border border-blue-200 rounded-lg shadow-sm transition-all mb-4">
          <div className="text-sm font-semibold text-blue-700">
            Selected {selectedIds.length} student{selectedIds.length > 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds([])}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Unselect
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Bulk Transfer ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all enrollments"
                />
              </TableHead>
              <TableHead className="text-center w-[50px]">Sl</TableHead>
              <TableHead className="text-center min-w-[90px]">Action</TableHead>
              <TableHead className="text-start min-w-[150px]">
                Student Details
              </TableHead>
              <TableHead className="min-w-[150px]">Course & Batch</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center min-w-[120px]">
                Enrollment Date
              </TableHead>
              <TableHead className="text-center min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[120px]">Pay Amount</TableHead>
              <TableHead className="text-center min-w-[120px]">
                Payment Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {enrollments.map((enrollment, i) => {
              const isSelected = selectedIds.includes(enrollment.id);
              return (
                <TableRow
                  key={enrollment.id || i}
                  className={isSelected ? "bg-blue-50/30" : undefined}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(enrollment.id)}
                      aria-label={`Select enrollment ${enrollment.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {(page - 1) * perPage + (i + 1)}
                  </TableCell>
                  <TableCell className="text-center">
                    {enrollment?.id && (
                      <EnrollmentActionMenu
                        enrollmentId={enrollment.id}
                        currentStatus={enrollment.status}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-start">
                    <p>{enrollment?.user?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">
                      {enrollment?.user?.phone || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enrollment?.user?.email || "N/A"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p title={enrollment?.batch?.course?.title}>
                      {enrollment?.batch?.course
                        ? truncate(enrollment?.batch?.course?.title) || "N/A"
                        : "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enrollment?.batch?.name || "N/A"}{" "}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    {enrollment?.discount_amount ? (
                      <del className="text-xs text-muted-foreground block">
                        {enrollment?.original_price
                          ? formatCurrency(enrollment.original_price)
                          : "N/A"}
                      </del>
                    ) : null}
                    <span className="font-semibold text-primary">
                      {enrollment?.final_price
                        ? formatCurrency(enrollment.final_price)
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-center" suppressHydrationWarning>
                    {enrollment?.enrollment_date
                      ? new Date(enrollment.enrollment_date).toLocaleDateString("en-GB")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        enrollment?.status_label === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {enrollment?.status_label || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <span className="text-primary font-bold">
                      {enrollment?.payment_amount
                        ? formatCurrency(enrollment.payment_amount)
                        : ""}
                    </span>{" "}
                    <br />
                    <span className="text-red-500 text-xs font-medium">
                      {enrollment?.due_amount
                        ? "Due: " + formatCurrency(enrollment.due_amount)
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        enrollment?.payment_status_label === "Paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {enrollment?.payment_status_label || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}

      {/* Bulk Transfer Modal */}
      <BulkTransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedIds={selectedIds}
        onSuccess={() => setSelectedIds([])}
      />
    </>
  );
}
