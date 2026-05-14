import {
  CRMNotificationCountResponse,
  getCRMNotificationCount,
} from "@/apiServices/crmNotification";
import { BellRing } from "lucide-react";
import Link from "next/link";

const DashboardNotification = async () => {
  let notificationCount: CRMNotificationCountResponse | null = null;
  try {
    notificationCount = await getCRMNotificationCount();
  } catch (error: unknown) {
    console.error("Error fetching notification count:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      notificationCount = null;
    } else {
      console.error("Unknown error type");
      notificationCount = null;
    }
  }

  if (!notificationCount) {
    return null;
  }

  return (
    <Link
      href={`${notificationCount?.data.unread_count > 0 ? "/crm/notifications" : "#"}`}
    >
      <button className="relative flex items-center justify-center w-10 h-10 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
        {/* Notification Icon */}
        <BellRing className="w-5 h-5 text-secondary" />

        {/* Count Badge */}
        {notificationCount?.data.unread_count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-semibold border-2 border-white shadow">
            {notificationCount?.data.unread_count > 0
              ? notificationCount?.data.unread_count
              : ""}
          </span>
        )}
      </button>
    </Link>
  );
};

export default DashboardNotification;
