import { Suspense } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/admin/AppSidebar";
import { Separator } from "@/components/ui/separator";
import DashboardNotification from "@/components/common/DashboardNotification";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense
        fallback={<div className="w-64 h-screen bg-muted animate-pulse" />}
      >
        <AppSidebar />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
          <SidebarInset className="h-svh overflow-hidden">
            <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DashboardNotification />
            </header>
            <div className="h-[calc(100svh-64px)] bg-gray-50 p-4 py-8 min-w-0 overflow-y-auto">
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </div>
          </SidebarInset>
        </Suspense>
    </SidebarProvider>
  );
}
