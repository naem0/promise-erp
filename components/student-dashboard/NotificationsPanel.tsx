"use client";
import { useState } from "react";
import { ChevronLeft, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotificationItem, { NotificationData } from "./NotificationItem";

const initialNotifications: NotificationData[] = [
  {
    id: "1",
    icon: "course",
    title: "New Course Launched!",
    highlight: "Web Development Masterclass",
    message: "is now open for enrollment. Join today to secure your seat.",
    time: "2 hours ago",
    isUnread: true,
  },
  {
    id: "2",
    icon: "webinar",
    title: "A new",
    highlight: "career guidance webinar",
    message: "has been added. Don't miss the expert insights this Friday.",
    time: "Yesterday, 5:12 PM",
    isUnread: true,
  },
  {
    id: "3",
    icon: "info",
    title: "New lessons have been added to",
    highlight: "Graphic Design Fundamentals",
    message: ". Check the updated modules in your dashboard.",
    time: "3 days ago",
    isUnread: false,
  },
  {
    id: "4",
    icon: "payment",
    title: "Your",
    highlight: "2nd installment",
    message: "for Professional Graphics Design is now due. Please complete payment to continue learning.",
    time: "1 week ago",
    isUnread: false,
  },
  {
    id: "5",
    icon: "update",
    title: "We've improved dashboard performance and fixed minor issues for a smoother experience.",
    message: "",
    time: "2 weeks ago",
    isUnread: false,
  },
  {
    id: "6",
    icon: "certificate",
    title: "Congratulations! You've completed",
    highlight: "Freelancing Basics",
    message: ". Your certificate is now available.",
    time: "2 weeks ago",
    isUnread: false,
  },
];

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className=" ">
      <div className="mb-6 flex items-center gap-3">
        <button aria-label="Go back" className="rounded-lg p-2 text-secondary transition-colors">
          <ChevronLeft className="h-7 w-7" />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-secondary">
          Notifications
        </h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/50 bg-primary/10">
        <div className="bg-primary px-4 py-3">
          <Badge
            className="bg-white px-3 py-1 text-base font-bold text-black capitalize"
          >
            Unread({unreadCount})
          </Badge>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-border/50">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="px-4 py-3"
            >
              <NotificationItem
                notification={notification}
                onDismiss={handleDismiss}
                index={index}
              />
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-primary p-4">
              <Bell className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-lg font-medium text-secondary">All caught up!</p>
            <p className="text-sm text-secondary">
              No notifications to show
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
