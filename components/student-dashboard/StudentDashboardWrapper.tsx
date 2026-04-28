import { getStudentDashboard } from "@/apiServices/studentDashboardService";
import dynamic from 'next/dynamic';
const DashboardStatsGrid = dynamic(() => import('@/components/student-dashboard/DashboardStatsGrid'));
const AttendanceReportCard = dynamic(() => import('@/components/student-dashboard/AttendanceReportCard'));
import DuePayments from "./DuePayments";
import UpcomingClasses from "./UpcomingClasses";
import WelcomeBanner from "./WelcomeBanner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const StudentDashboardWrapper = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>Unauthorized</div>;
  }

  const dashboardData = await getStudentDashboard(session.accessToken);
  const { cards, class_attendance , upcoming_classes , due_payments } = dashboardData?.data || {};

  const hasCards = cards && Object.keys(cards).length > 0;
  const hasDuePayments = due_payments && Object.keys(cards).length > 0;

  return (
    <>
      {/* <WelcomeBanner /> */}

      {hasCards ? (
        <DashboardStatsGrid cards={cards} />
      ) : (
        null
      )}

      <div className="px-4">
        {class_attendance.length > 0 ? (
          <AttendanceReportCard data={class_attendance} />
        ) : (
          null
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 px-4 py-4">
        {upcoming_classes.length > 0 ? (
          <UpcomingClasses classesData={upcoming_classes} />
        ) : (
          null
        )}
        {
          hasDuePayments ? (
            <DuePayments duePayments={due_payments} />
          ) : (
            null
          )
        }
      </div>
    </>
  );
};

export default StudentDashboardWrapper;
