"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_PAID,
  PAYMENT_STATUS_REFUNDED,
  PAYMENT_STATUS_REJECTED,
} from "@/apiServices/paymentConstants";
import { updatePaymentHistoryStatus } from "@/apiServices/paymentHistoryService";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PaymentHistoryStatusDropdownProps {
  paymentHistoryId: number;
  currentStatus: string | undefined;
}

export default function PaymentHistoryStatusDropdown({
  paymentHistoryId,
  currentStatus,
}: PaymentHistoryStatusDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingStatus, setPendingStatus] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusValue = (statusName?: string): number => {
    if (!statusName) return PAYMENT_STATUS_PENDING;
    const statusLower = statusName.toLowerCase();
    if (statusLower === "paid") return PAYMENT_STATUS_PAID;
    if (statusLower === "refunded") return PAYMENT_STATUS_REFUNDED;
    if (statusLower === "rejected") return PAYMENT_STATUS_REJECTED;
    return PAYMENT_STATUS_PENDING;
  };

  const currentStatusValue = getStatusValue(currentStatus);

  const handleStatusChange = (newStatus: string) => {
    const statusNum = Number(newStatus);

    // If status is not changing, do nothing
    if (statusNum === currentStatusValue) {
      return;
    }

    setPendingStatus(statusNum);
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatus === null) return;

    startTransition(async () => {
      try {
        await updatePaymentHistoryStatus(paymentHistoryId, {
          payment_status: pendingStatus,
        });

        const statusNames: Record<number, string> = {
          [PAYMENT_STATUS_PENDING]: "Pending",
          [PAYMENT_STATUS_PAID]: "Paid",
          [PAYMENT_STATUS_REFUNDED]: "Refunded",
          [PAYMENT_STATUS_REJECTED]: "Rejected",
        };

        toast.success(`Payment status changed to ${statusNames[pendingStatus]}`);
        setIsDialogOpen(false);
        setPendingStatus(null);
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update payment status");
        }
        setIsDialogOpen(false);
        setPendingStatus(null);
      }
    });
  };

  const statusNames: Record<number, string> = {
    [PAYMENT_STATUS_PENDING]: "Pending",
    [PAYMENT_STATUS_PAID]: "Paid",
    [PAYMENT_STATUS_REFUNDED]: "Refunded",
    [PAYMENT_STATUS_REJECTED]: "Rejected",
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case PAYMENT_STATUS_PAID:
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case PAYMENT_STATUS_PENDING:
        return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case PAYMENT_STATUS_REFUNDED:
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case PAYMENT_STATUS_REJECTED:
        return "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  return (
    <>
      <Select
        value={currentStatusValue.toString()}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className={`w-[130px] h-8 font-medium ${getStatusColor(currentStatusValue)}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PAYMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
          <SelectItem value={PAYMENT_STATUS_PAID.toString()}>Paid</SelectItem>
          <SelectItem value={PAYMENT_STATUS_REFUNDED.toString()}>Refunded</SelectItem>
          <SelectItem value={PAYMENT_STATUS_REJECTED.toString()}>Rejected</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Payment Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the payment status to{" "}
              <strong>{pendingStatus !== null ? statusNames[pendingStatus] : ""}</strong>?
              This action will update the payment history status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} onClick={() => setPendingStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={confirmStatusChange} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Yes, Change Status"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
