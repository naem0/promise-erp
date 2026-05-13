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

// Rotating gradient palette for the icon background
const iconGradients = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-500",
    "from-indigo-500 to-blue-600",
];

const CRMNotificationCard = ({ notification, index = 0 }: CRMNotificationCardProps) => {
    const [isRead, setIsRead] = useState(notification.read_at !== null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

    const gradient = iconGradients[index % iconGradients.length];

    const handleMarkRead = () => {
        if (isRead || isPending) return;

        startTransition(async () => {
            try {
                const result = await markCRMNotificationAsRead(notification?.id);
                console.log("---->", result);
                if (result.success) {
                    toast.success(result.message || "Notification marked as read successfully");
                    setIsRead(true);
                    router.push(`/crm/leads-activity/${notification?.lead_id}/manage`);
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
                "group relative flex items-start gap-4 px-5 py-4 transition-all duration-200",
                !isRead
                    ? "cursor-pointer bg-gradient-to-r from-violet-50/70 via-white to-indigo-50/50 hover:from-violet-100/80 hover:to-indigo-100/60"
                    : "bg-secondary/10 hover:bg-secondary/20 "
            )}
            title={!isRead ? "Click to mark as read" : undefined}
        >
            {/* Left accent bar */}
            <span
                className={cn(
                    "absolute left-0 top-0 h-full w-[3px] rounded-r-full transition-all duration-300",
                    !isRead
                        ? "bg-gradient-to-b from-violet-500 to-indigo-500"
                        : "bg-transparent"
                )}
            />

            {/* Icon */}
            <div
                className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform duration-200 group-hover:scale-105",
                    isRead
                        ? "bg-gradient-to-br from-slate-200 to-slate-300"
                        : `bg-gradient-to-br ${gradient}`
                )}
            >
                <BellRing
                    className={cn(
                        "h-5 w-5",
                        isRead ? "text-slate-400" : "text-white"
                    )}
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        "text-sm leading-snug",
                        isRead
                            ? "text-slate-400"
                            : "font-semibold text-slate-800"
                    )}
                >
                    {notification.message}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {/* Name badge */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            isRead
                                ? "bg-slate-100 text-slate-400"
                                : "bg-violet-100 text-violet-700"
                        )}
                    >
                        <User className="h-3 w-3" />
                        {notification.name}
                    </span>

                    {/* Phone badge */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            isRead
                                ? "bg-slate-100 text-slate-400"
                                : "bg-sky-100 text-sky-700"
                        )}
                    >
                        <Phone className="h-3 w-3" />
                        {notification.phone}
                    </span>

                    {/* Lead ID badge */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            isRead
                                ? "bg-slate-100 text-slate-400"
                                : "bg-amber-100 text-amber-700"
                        )}
                    >
                        <Hash className="h-3 w-3" />
                        Lead {notification.lead_id}
                    </span>
                </div>
            </div>

            {/* Status indicator */}
            <div className="flex shrink-0 flex-col items-end gap-1 pl-2">
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                ) : isRead ? (
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                ) : (
                    <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500" />
                    </span>
                )}
                {!isRead && !isPending && (
                    <span className="font-medium text-primary">
                        Tap to read
                    </span>
                )}
            </div>
        </div>
    );
};

export default CRMNotificationCard;
