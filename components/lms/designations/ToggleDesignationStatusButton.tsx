"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleDesignationStatus } from "@/apiServices/designationService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToggleDesignationStatusButtonProps {
    id: number;
    initialStatus: string;
}

export default function ToggleDesignationStatusButton({
    id,
    initialStatus,
}: ToggleDesignationStatusButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const isActive = initialStatus.toLowerCase() === "active";

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const res = await toggleDesignationStatus(id);
            if (res.success) {
                toast.success(res.message || "Status updated successfully");
                router.refresh();
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
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
