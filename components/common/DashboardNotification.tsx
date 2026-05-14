"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCRMNotificationCount } from "@/apiServices/crmNotification";
import { BellRing } from "lucide-react";
import Link from "next/link";

const DashboardNotification = () => {
  const pathname = usePathname();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNotificationCount = async () => {
      try {
        const response = await getCRMNotificationCount();
        if (isMounted && response?.success && response?.data) {
          setNotificationCount(response.data.unread_count);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotificationCount();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (loading) {
    return (
      <button className="relative flex items-center justify-center w-10 h-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <BellRing className="w-5 h-5 text-secondary opacity-50" />
      </button>
    );
  }

  return (
    <Link href={`/crm/notifications`}>
      <button className="relative flex items-center justify-center w-10 h-10 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
        {/* Notification Icon */}
        <BellRing className="w-5 h-5 text-secondary" />

        {/* Count Badge */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-semibold border-2 border-white shadow">
            {notificationCount}
          </span>
        )}
      </button>
    </Link>
  );
};

export default DashboardNotification;
