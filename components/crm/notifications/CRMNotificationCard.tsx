"use client";

import { useState, useTransition } from "react";
import {
  CRMNotification,
  markCRMNotificationAsRead,
} from "@/apiServices/crmNotification";
import {
  Phone,
  User,
  CheckCircle2,
  Loader2,
  BellRing,
  Hash,
  Clock,
} from "lucide-react";
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

const CRMNotificationCard = ({
  notification,
  index = 0,
}: CRMNotificationCardProps) => {
  const [isRead, setIsRead] = useState(notification.read_at !== null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          toast.success(
            result.message || "Notification marked as read successfully",
          );
          setIsRead(true);
          router.push(`/crm/lead-activities/${notification?.lead_id}/manage`);
        } else {
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
        "group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 xl:gap-8 px-4 py-3 rounded-lg border transition-colors",
        !isRead
          ? "cursor-pointer bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
          : "cursor-pointer bg-slate-200/40 hover:bg-slate-200/50 border-slate-200 shadow-sm",
      )}
      title={
        !isRead ? "Click to mark as read" : "Already read • Click to view lead"
      }
    >
      {/* Left accent bar */}
      <span
        className={cn(
          "hidden sm:block absolute left-0 top-0 h-full w-1",
          !isRead
            ? "bg-gradient-to-b from-indigo-500 to-blue-500"
            : "bg-transparent",
        )}
      />

      {/* Icon container */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform",
          isRead
            ? "bg-slate-100/80"
            : `bg-gradient-to-br ${gradient} group-hover:scale-105`,
        )}
      >
        <BellRing
          className={cn("h-4 w-4", isRead ? "text-slate-500" : "text-white")}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1.5">

        <p
          className={cn(
            "text-base font-semibold pb-1 mb-0",
            isRead && "text-secondary text-sm font-normal ",
          )}
        >
          Course Name: <span className="text-primary">{notification?.course_name}</span>
        </p>

        <span className="text-sm text-slate-800 inline-block pb-1">{notification?.message}</span>

        <div className="flex flex-wrap items-center gap-2">
          {/* Name badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border transition-colors",
              isRead
                ? "bg-transparent text-indigo-700/70 border-slate-200/60"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-100",
            )}
          >
            <User className="h-3 w-3" />
            <span className="truncate">{notification.name}</span>
          </span>

          {/* Phone badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border transition-colors",
              isRead
                ? "bg-transparent text-blue-700/70 border-slate-200/60"
                : "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100",
            )}
          >
            <Phone className="h-3 w-3" />
            <span className="truncate">{notification.phone}</span>
          </span>

          {/* Lead ID badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border transition-colors",
              isRead
                ? "bg-transparent text-teal-700/70 border-slate-200/60"
                : "bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-teal-100",
            )}
          >
            <Hash className="h-3 w-3" />
            <span className="truncate">Lead {notification.lead_id}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border transition-colors",
              isRead
                ? "bg-transparent text-teal-700/70 border-slate-200/60"
                : "bg-teal-50 text-black border-teal-200 group-hover:bg-teal-100",
            )}
          >
            <Clock className="h-3 w-3" />
            {notification?.created_at_human}
          </span>
        </div>
        <p
          className={cn(
            "text-base font-semibold pb-1 mb-0",
            isRead && "text-secondary text-sm font-normal ",
          )}
        >
          Consultant Name: <span className="text-primary">{notification?.consultant?.name} , {notification?.consultant?.phone}</span>
        </p>
      </div>

      {/* Status indicator */}
      <div className="flex shrink-0 items-center justify-center pl-0 sm:pl-3 pt-1 sm:pt-0">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
        ) : isRead ? (
          <CheckCircle2 className="h-4 w-4 text-slate-400" />
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
