import StudentDashboardHeader from "@/components/student-dashboard/StudentDashboardHeader";
import { StudentSidebar } from "@/components/student-dashboard/StudentSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Suspense } from "react";
import PaymentStatusPrompt from "@/components/student-dashboard/PaymentStatusPrompt";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <Suspense fallback={<div className="w-64 h-screen bg-muted animate-pulse" />}>
          <StudentSidebar />
        </Suspense>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <StudentDashboardHeader />
          </header>
          <div className="w-full h-screen-16 overflow-y-auto min-w-0">
            {children}
            <Suspense fallback={null}>
              <PaymentStatusPrompt />
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
