import dynamic from "next/dynamic";
const UpcomingCategoryCarousel = dynamic(
  () => import("@/components/student-dashboard/UpcomingCategoryCarousel"),
);
import UpcomingCourseCard from "@/components/student-dashboard/UpcomingCourseCard";
import Pagination from "@/components/common/Pagination";
import {
  getUpcomingCourses,
  UpcomingCourse,
} from "@/apiServices/studentDashboardService";
import { UpcomingCoursesParams } from "@/app/student/upcomingcourses/page";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import ErrorComponent from "../common/ErrorComponent";

const UpcomingCourseWrapper = async ({
  searchParams,
}: UpcomingCoursesParams) => {
  const queryParams = await searchParams;

  const params = {
    category_slug: queryParams.category_slug ?? "",
    per_page: queryParams.per_page ?? 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let upcomingCourses = null;
  try {
    upcomingCourses = await getUpcomingCourses({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={
              upcomingCourses?.message || "Failed to fetch upcoming courses"
            }
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  const courses = upcomingCourses?.data?.courses || [];
  const categories = upcomingCourses?.data?.categories || [];
  const pagination = upcomingCourses?.data?.pagination || null;
  if (!upcomingCourses || !upcomingCourses?.success || !upcomingCourses?.data) {
    return null;
  }

  if (courses?.length === 0) {
    return (
      <NotFoundComponent
        message={upcomingCourses?.message || " No upcoming courses found"}
        title="Upcoming Course List"
      />
    );
  }

  return (
    <>
      {/* Cards */}
      {categories?.length > 0 && (
        <div className="px-4">
          <UpcomingCategoryCarousel categories={categories} />
        </div>
      )}
      <div className="py-6 px-4">
        <div className="grid xl:grid-cols-3 2xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
          {courses?.map((course: UpcomingCourse, index: number) => (
            <UpcomingCourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      {pagination && (
        <Pagination pagination={pagination} />
      )}
    </>
  );
};

export default UpcomingCourseWrapper;
