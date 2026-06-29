import { Suspense } from "react";
import StudentDashboardWrapper from "@/components/student-dashboard/StudentDashboardWrapper";
import DashboardLoadingSkeleton from "@/components/common/DashboardLoadingSkeleton";

const StudentDashboardPage = () => {
  return (
    <section className="py-4 px-4">
      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <StudentDashboardWrapper />
      </Suspense>
    </section>
  );
};

export default StudentDashboardPage;
