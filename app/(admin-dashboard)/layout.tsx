import { Suspense } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset, } from "@/components/ui/sidebar"
import AppSidebar from "@/components/admin/AppSidebar"
import { Separator } from "@/components/ui/separator"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
          <SidebarProvider>
        <Suspense fallback={<div className="w-64 h-screen bg-muted animate-pulse" />}>
          <AppSidebar />
        </Suspense>
        <main className="w-full">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </header>
            <div className="">{children}</div>
          </SidebarInset>
        </main>
      </SidebarProvider>
      )
}