import MyCoursesGrid from "@/components/student-dashboard/MyCoursesGrid";
import PaymentStatusPrompt from "@/components/student-dashboard/PaymentStatusPrompt";
import { Suspense } from "react";

const MyCoursesPage = async () => {
  
  return (
    <>
      <div className="px-4">
          <MyCoursesGrid />
      </div>
      <Suspense fallback={null}>
        <PaymentStatusPrompt />
      </Suspense>
    </>
  );
};

export default MyCoursesPage;
