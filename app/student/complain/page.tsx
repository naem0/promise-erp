import { Suspense } from "react";
import ComplainListServer from "@/components/student-dashboard/complain/ComplainListServer";
import ComplainSkeleton from "@/components/student-dashboard/complain/ComplainSkeleton";

export default function StudentComplainPage() {
  return (
    <section className="px-4 py-8 md:py-12">
      <Suspense fallback={<ComplainSkeleton />}>
        <ComplainListServer />
      </Suspense>
    </section>
  );
}
