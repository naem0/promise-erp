import MyCoursesGrid from "@/components/student-dashboard/MyCoursesGrid";
import MyCourseSkeleton from "@/components/student-dashboard/MyCourseSkeleton";
import { Suspense } from "react";

const MyCoursesPage = async () => {
  
  return (
    <>
      <div className="px-4">
        <Suspense fallback={<MyCourseSkeleton />}>
          <MyCoursesGrid />
        </Suspense>
      </div>
    </>
  );
};

export default MyCoursesPage;
