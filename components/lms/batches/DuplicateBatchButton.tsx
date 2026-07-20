"use client";

import { useTransition } from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { duplicateBatch } from "@/apiServices/batchService";

interface DuplicateBatchButtonProps {
  id: number;
}

export default function DuplicateBatchButton({ id }: DuplicateBatchButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await duplicateBatch(id);
        if (res?.success) {
          toast.success(res?.message || "Batch duplicated successfully");
        } else {
          toast.error(res?.message || "Failed to duplicate batch");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        toast.error(message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={isPending}
      className="flex w-full items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
          <span>Duplicating...</span>
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Duplicate</span>
        </>
      )}
    </button>
  );
}
