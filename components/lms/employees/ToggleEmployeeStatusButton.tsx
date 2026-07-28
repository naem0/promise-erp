"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleEmployeeStatus } from "@/apiServices/employeeService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToggleEmployeeStatusButtonProps {
  id: number;
  isBlocked: number;
}

export default function ToggleEmployeeStatusButton({
  id,
  isBlocked,
}: ToggleEmployeeStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [currentIsBlocked, setCurrentIsBlocked] = useState(isBlocked);
  const router = useRouter();

  const isActive = Number(currentIsBlocked) === 0;

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const res = await toggleEmployeeStatus(id);
        if (res?.success) {
          toast.success(res?.message || "Status updated successfully");
          if (res?.data?.is_blocked !== undefined) {
            setCurrentIsBlocked(res?.data?.is_blocked);
          }
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to update status");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error?.message);
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
