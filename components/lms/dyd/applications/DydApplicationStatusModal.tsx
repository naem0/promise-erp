"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { bulkUpdateDydApplicationStatus } from "@/apiServices/dydApplicationService";

export const DYD_STATUS_MAP: Record<
  number,
  { label: string; className: string }
> = {
  1: {
    label: "Initial Applied",
    className: "bg-blue-50 text-blue-700 border border-blue-200 font-medium",
  },
  2: {
    label: "Exam Notice Sent",
    className: "bg-amber-50 text-amber-700 border border-amber-200 font-medium",
  },
  3: {
    label: "Written Passed",
    className:
      "bg-purple-50 text-purple-700 border border-purple-200 font-medium",
  },
  4: {
    label: "Final Selected",
    className:
      "bg-green-50 text-green-700 border border-green-200 font-medium",
  },
  5: {
    label: "Not Selected",
    className: "bg-red-50 text-red-700 border border-red-200 font-medium",
  },
};

interface DydApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetIds: number[];
  currentStatus?: number;
  onSuccess?: () => void;
}

export default function DydApplicationStatusModal({
  isOpen,
  onClose,
  targetIds,
  currentStatus,
  onSuccess,
}: DydApplicationStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus ? String(currentStatus) : "1"
  );
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!targetIds.length) {
      toast.error("No applications selected.");
      return;
    }

    startTransition(async () => {
      try {
        const statusNum = Number(selectedStatus);
        const res = await bulkUpdateDydApplicationStatus(targetIds, statusNum);

        if (res?.success) {
          toast.success(
            res.message ||
              `Status updated successfully for ${targetIds.length} application(s).`
          );
          onSuccess?.();
          onClose();
        } else {
          toast.error(res.message || "Failed to update status.");
        }
      } catch (error: unknown) {
        console.error("Status update error:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred while updating status.");
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Update Application Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <p className="text-sm text-muted-foreground">
            Updating status for{" "}
            <span className="font-semibold text-foreground">
              {targetIds.length} application{targetIds.length > 1 ? "s" : ""}
            </span>
            .
          </p>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Select New Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. Initial Applied</SelectItem>
                <SelectItem value="2">2. Exam Notice Sent</SelectItem>
                <SelectItem value="3">3. Written Passed</SelectItem>
                <SelectItem value="4">4. Final Selected</SelectItem>
                <SelectItem value="5">5. Not Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
