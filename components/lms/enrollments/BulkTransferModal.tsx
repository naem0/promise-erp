"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bulkTransferEnrollments } from "@/apiServices/enrollmentService";
import { getPublicBatches, PublicBatchItem } from "@/apiServices/batchService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BulkTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: number[];
  onSuccess?: () => void;
}

interface BulkTransferFormValues {
  to_batch_id: number | string;
  remarks?: string;
}

export default function BulkTransferModal({
  isOpen,
  onClose,
  selectedIds,
  onSuccess,
}: BulkTransferModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [batches, setBatches] = useState<PublicBatchItem[]>([]);
  const [loadingBatches, setLoadingBatches] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<PublicBatchItem | null>(
    null,
  );
  const [openBatchPopover, setOpenBatchPopover] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BulkTransferFormValues>({
    defaultValues: {
      to_batch_id: "",
      remarks: "",
    },
  });

  // Fetch batches list when modal opens or search changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchBatches = async () => {
      setLoadingBatches(true);
      try {
        const res = await getPublicBatches(searchQuery);
        if (isMounted && res?.data) {
          setBatches(res?.data?.batches);
        }
      } catch (err: unknown) {
        console.error("Error fetching batches:", err);
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unexpected error occurred while fetching batches.");
        }
      } finally {
        if (isMounted) {
          setLoadingBatches(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchBatches();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, searchQuery]);

  // Reset form state on modal close/open
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedBatch(null);
      setSearchQuery("");
      reset();
      onClose();
    }
  };

  const onSubmit = (data: BulkTransferFormValues) => {
    if (selectedIds.length === 0) {
      toast.error("No enrollments selected.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await bulkTransferEnrollments({
          enrollment_ids: selectedIds,
          to_batch_id: Number(data.to_batch_id),
          remarks: data.remarks?.trim() || undefined,
        });

        if (res.success) {
          toast.success(
            res.message ||
              `${selectedIds.length} student(s) transferred successfully`,
          );
          handleOpenChange(false);
          if (onSuccess) onSuccess();
          router.refresh();
        } else {
          if (res.errors && typeof res.errors === "object") {
            Object.keys(res.errors).forEach((key) => {
              const fieldKey = key as keyof BulkTransferFormValues;
              const messages = res.errors![key];
              const errorMessage = Array.isArray(messages)
                ? messages[0]
                : String(messages);
              setError(fieldKey, {
                type: "server",
                message: errorMessage,
              });
            });
          }
          toast.error(res.message || "Failed to transfer students.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred during bulk transfer.");
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Bulk Transfer Students
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Transfer the {selectedIds.length} selected student(s) to another
            batch. The enrollment final price, payments, and remaining due
            amount for all selected students will be recalculated automatically
            according to the new batch pricing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Target Batch Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Select Target Batch <span className="text-red-500">*</span>
            </Label>

            <Controller
              name="to_batch_id"
              control={control}
              rules={{ required: "Target batch is required." }}
              render={({ field }) => (
                <div>
                  <Popover
                    open={openBatchPopover}
                    onOpenChange={setOpenBatchPopover}
                  >
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer">
                        <button
                          type="button"
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm text-left bg-background hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary",
                            errors.to_batch_id && "border-red-500",
                          )}
                        >
                          <span
                            className={
                              selectedBatch
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {selectedBatch
                              ? `${selectedBatch.batch_name} (${selectedBatch.course_name})`
                              : "Search batch or course..."}
                          </span>
                          {selectedBatch ? (
                            <X
                              className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBatch(null);
                                field.onChange("");
                              }}
                            />
                          ) : (
                            <Search className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] p-2" align="start">
                      <div className="flex items-center border-b px-3 pb-2 mb-2">
                        <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search batch or course..."
                          className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                        {searchQuery && (
                          <X
                            className="w-4 h-4 cursor-pointer text-muted-foreground"
                            onClick={() => setSearchQuery("")}
                          />
                        )}
                      </div>

                      <div className="max-h-[220px] overflow-y-auto space-y-1">
                        {loadingBatches ? (
                          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Loading batches...
                          </div>
                        ) : batches?.length ? (
                          batches?.map((batch) => (
                            <div
                              key={batch?.batch_id}
                              onClick={() => {
                                setSelectedBatch(batch);
                                field.onChange(batch?.batch_id);
                                clearErrors("to_batch_id");
                                setOpenBatchPopover(false);
                              }}
                              className={cn(
                                "px-3 py-2 text-sm rounded-md cursor-pointer transition-colors hover:bg-accent",
                                selectedBatch?.batch_id === batch?.batch_id &&
                                  "bg-accent font-semibold text-primary",
                              )}
                            >
                              <div className="font-medium">
                                {batch?.batch_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {batch?.course_name} • {batch?.branch_name}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                            No data found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.to_batch_id && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.to_batch_id.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Remarks / Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Remarks / Reason</Label>
            <Textarea
              placeholder="Reason for transfer (optional)..."
              rows={3}
              className={cn("resize-none", errors.remarks && "border-red-500")}
              {...register("remarks")}
            />
            {errors.remarks && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.remarks.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Bulk Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
