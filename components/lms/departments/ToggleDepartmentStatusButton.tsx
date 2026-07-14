"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleDepartmentStatus } from "@/apiServices/departmentService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToggleDepartmentStatusButtonProps {
  id: number;
  currentStatus: number;
}

export default function ToggleDepartmentStatusButton({
  id,
  currentStatus,
}: ToggleDepartmentStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isActive = Number(currentStatus) === 1;

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await toggleDepartmentStatus(id);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Switch
        className="cursor-pointer"
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
