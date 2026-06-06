"use client";

import { CRMNotification } from "@/apiServices/crmNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CRMNotificationCard from "./CRMNotificationCard";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { BellRing, LayoutList } from "lucide-react";

interface CRMNotificationTabsProps {
    all: CRMNotification[];
    unread: CRMNotification[];
    unreadCount: number;
}

const CRMNotificationTabs = ({
    all,
    unread,
    unreadCount,
}: CRMNotificationTabsProps) => {
    return (
        <Tabs defaultValue="all" className="w-full">
            {/* ── Tab Buttons ── */}
            <TabsList className="w-full h-12 rounded-xl bg-slate-100 p-1 gap-1">

                {/* ALL tab — indigo/violet accent */}
                <TabsTrigger
                    value="all"
                    className="
                        relative flex-1 h-full flex items-center justify-center gap-2
                        rounded-lg text-sm font-semibold transition-all duration-200
                        text-slate-500 hover:text-indigo-600
                        data-[state=active]:bg-primary
                        data-[state=active]:text-white
                        data-[state=active]:shadow-md
                        data-[state=active]:shadow-indigo-200 cursor-pointer
                    "
                >
                    <LayoutList className="h-4 w-4" />
                    All Notifications
                    {/* <span
                        className="
                            inline-flex items-center justify-center rounded-full px-2 py-0.5
                            text-xs font-bold leading-none min-w-2
                            bg-slate-200 text-slate-600
                            data-[state=active]:bg-white/25 data-[state=active]:text-white
                        "
                    >
                        {all.length}
                    </span> */}
                </TabsTrigger>

                {/* UNREAD tab — rose/orange accent */}
                <TabsTrigger
                    value="unread"
                    className="
                        relative flex-1 h-full flex items-center justify-center gap-2
                        rounded-lg text-sm font-semibold transition-all duration-200
                        text-slate-500 hover:text-rose-600
                        data-[state=active]:bg-primary
                        data-[state=active]:text-white
                        data-[state=active]:shadow-md
                        data-[state=active]:shadow-rose-200 cursor-pointer
                    "
                >
                    <BellRing className="h-4 w-4" />
                    Unread
                    {unreadCount > 0 ? (
                        <span className="inline-flex items-center justify-center rounded-full min-w-2 bg-rose-500 px-2 py-0.5 text-xs font-bold text-white leading-none data-[state=active]:bg-white/25">
                            {unreadCount}
                        </span>
                    ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500 leading-none">
                            0
                        </span>
                    )}
                </TabsTrigger>
            </TabsList>

            {/* ── All Notifications ── */}
            <TabsContent value="all" className="mt-3">
                {all.length === 0 ? (
                    <NotFoundComponent message="No notifications found." />
                ) : (
                    <div className="flex flex-col gap-2">
                        {all.map((notification, index) => (
                            <CRMNotificationCard
                                key={notification.id}
                                notification={notification}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* ── Unread Only ── */}
            <TabsContent value="unread" className="mt-3">
                {unread.length === 0 ? (
                    <NotFoundComponent message="No unread notifications. You're all caught up! 🎉" />
                ) : (
                    <div className="flex flex-col gap-2">
                        {unread.map((notification, index) => (
                            <CRMNotificationCard
                                key={notification.id}
                                notification={notification}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
};

export default CRMNotificationTabs;
