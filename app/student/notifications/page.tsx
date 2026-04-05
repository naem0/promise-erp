import NotificationsPanel from "@/components/student-dashboard/NotificationsPanel"
import { Suspense } from "react"

const NotificationsPage = () => {
  return (
    <section className="py-4 px-4">
      <Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded-xl" />}>
        <NotificationsPanel />
      </Suspense>
    </section>
  )
}

export default NotificationsPage
