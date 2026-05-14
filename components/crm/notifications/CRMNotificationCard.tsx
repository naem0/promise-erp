"use client";

import { useState, useTransition } from "react";
import { CRMNotification, markCRMNotificationAsRead } from "@/apiServices/crmNotification";
import { Phone, User, CheckCircle2, Loader2, BellRing, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CRMNotificationCardProps {
    notification: CRMNotification;
    index?: number;
}

// Professional color palette for enterprise CRM
const iconGradients = [
    "from-indigo-600 to-indigo-700",
    "from-blue-600 to-blue-700",
    "from-teal-600 to-teal-700",
    "from-cyan-600 to-cyan-700",
    "from-slate-600 to-slate-700",
    "from-zinc-600 to-zinc-700",
];

const CRMNotificationCard = ({ notification, index = 0 }: CRMNotificationCardProps) => {
    const [isRead, setIsRead] = useState(notification.read_at !== null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

    const gradient = iconGradients[index % iconGradients.length];

    const handleMarkRead = () => {
        if (isPending) return;

        if (isRead) {
            router.push(`/crm/lead-activities/${notification?.lead_id}/manage`);
            return;
        }

        startTransition(async () => {
            try {
                const result = await markCRMNotificationAsRead(notification?.id);
                if (result.success) {
                    toast.success(result.message || "Notification marked as read successfully");
                    setIsRead(true);
                    router.push(`/crm/lead-activities/${notification?.lead_id}/manage`);
                }else{
                    toast.error(result.message || "Failed to mark notification as read");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message || "Failed to mark notification as read");
                } else {
                    toast.error("Failed to mark notification as read");
                }
            }
        });
    };

    return (
        <div
            onClick={handleMarkRead}
            className={cn(
                "group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 rounded-lg transition-all duration-300 ease-out",
                "border border-transparent",
                !isRead
                    ? "cursor-pointer bg-white hover:bg-slate-50/50 border-slate-200/50 hover:border-slate-300/70 shadow-sm hover:shadow-md hover:shadow-slate-200/50"
                    : "cursor-pointer bg-slate-100 hover:bg-slate-200/70 border-slate-200/60 hover:border-slate-300/60 shadow-sm"
            )}
            title={!isRead ? "Click to mark as read" : "Click to view lead"}
        >
            {/* Left accent bar - Professional style */}
            <span
                className={cn(
                    "hidden sm:block absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-300 ease-out",
                    !isRead
                        ? "bg-gradient-to-b from-indigo-600 via-blue-600 to-blue-700"
                        : "bg-transparent"
                )}
            />

            {/* Icon container - Responsive sizing */}
            <div
                className={cn(
                    "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-out",
                    "shadow-md hover:shadow-lg",
                    isRead
                        ? "bg-gradient-to-br from-slate-300 to-slate-400"
                        : `bg-gradient-to-br ${gradient} group-hover:shadow-lg group-hover:shadow-indigo-200`
                )}
                style={{
                    transform: !isPending && !isRead ? "translateZ(0)" : "none",
                }}
            >
                <BellRing
                    className={cn(
                        "h-5 w-5 sm:h-5 sm:w-5 transition-all duration-300",
                        isRead ? "text-slate-100" : "text-white"
                    )}
                />
            </div>

            {/* Content - Responsive layout */}
            <div className="min-w-0 flex-1 space-y-2.5 sm:space-y-2">
                <p
                    className={cn(
                        "text-sm sm:text-sm font-semibold leading-relaxed transition-colors duration-300",
                        "text-slate-900"
                    )}
                >
                    {notification.message}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Name badge - Professional styling */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-300",
                            "border border-transparent",
                            isRead
                                ? "bg-slate-100/60 text-indigo-700 border-slate-200/40"
                                : "bg-indigo-50/80 text-indigo-700 border-indigo-200/50 group-hover:bg-indigo-100/60 group-hover:border-indigo-300/60"
                        )}
                    >
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{notification.name}</span>
                    </span>

                    {/* Phone badge - Professional styling */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-300",
                            "border border-transparent",
                            isRead
                                ? "bg-slate-100/60 text-blue-700 border-slate-200/40"
                                : "bg-blue-50/80 text-blue-700 border-blue-200/50 group-hover:bg-blue-100/60 group-hover:border-blue-300/60"
                        )}
                    >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{notification.phone}</span>
                    </span>

                    {/* Lead ID badge - Professional styling */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-300",
                            "border border-transparent",
                            isRead
                                ? "bg-slate-100/60 text-teal-700 border-slate-200/40"
                                : "bg-teal-50/80 text-teal-700 border-teal-200/50 group-hover:bg-teal-100/60 group-hover:border-teal-300/60"
                        )}
                    >
                        <Hash className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Lead {notification.lead_id}</span>
                    </span>
                </div>
            </div>

            {/* Status indicator - Responsive positioning */}
            <div className="flex shrink-0 items-center justify-center pl-0 sm:pl-3 pt-1 sm:pt-0">
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600 transition-colors duration-300" />
                ) : isRead ? (
                    <CheckCircle2 className="h-5 w-5 text-teal-600 transition-all duration-300" />
                ) : (
                    <span className="relative flex h-3 w-3 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-indigo-400 opacity-50" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-600" />
                    </span>
                )}
            </div>
        </div>
    );
};

export default CRMNotificationCard;
