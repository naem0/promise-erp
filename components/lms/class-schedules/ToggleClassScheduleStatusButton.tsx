"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleClassScheduleStatus } from "@/apiServices/classSchedulesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToggleClassScheduleStatusButtonProps {
  id: number;
  currentStatus: number;
}

export default function ToggleClassScheduleStatusButton({
  id,
  currentStatus,
}: ToggleClassScheduleStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isActive = Number(currentStatus) === 1;

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const res = await toggleClassScheduleStatus(id);
        if (res.success) {
          toast.success(res.message || "Status updated successfully");
          router.refresh();
        } else {
          toast.error(res.message || "Failed to update status");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Skeleton className="h-5 w-9 rounded-full bg-slate-300 border border-slate-400 " />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Switch
        aria-label="Toggle status"
        className="cursor-pointer"
        checked={isActive}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
