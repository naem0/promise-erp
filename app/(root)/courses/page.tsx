import { Suspense } from "react";
import CourseCardSkeleton from "@/components/common/CourseCardSkeleton";
import CourseFilterSidebar from "@/components/root/courseList/CourseFilterSidebar";
import HeaderBanner from "@/components/root/courseList/HeaderBanner";
import CourseListWrapper from "@/components/root/courseList/CourseListWrapper";
import { Card } from "@/components/ui/card";
import CourseFilterSkeleton from "@/components/root/courseList/CourseFilterSkeleton";
import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import { CourseFilterProvider } from "@/components/root/courseList/CourseFilterContext";
import CourseListClientView from "@/components/root/courseList/CourseListClientView";
import CourseMobileFilterWrapper from "@/components/root/courseList/CourseMobileFilterWrapper";

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const CoursesPage = ({ searchParams }: CoursesPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <HeaderBanner />
      </Suspense>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="py-3 px-4 mb-6 md:mb-8 border-none bg-transparent shadow-none">
          <h1 className="text-2xl md:text-4xl text-center font-bold text-secondary">
            All Courses
          </h1>
        </Card>

        <CourseFilterProvider>
          {/* Mobile & Tablet Search & Filter Drawer Control Bar (< lg) */}
          <div className="xl:hidden mb-6">
            <Suspense fallback={null}>
              <CourseMobileFilterWrapper searchParams={searchParams} />
            </Suspense>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
            {/* Desktop Filter Sidebar (>= lg) */}
            <aside className="hidden xl:block lg:w-80 shrink-0">
              <Suspense fallback={<CourseFilterSkeleton />}>
                <CourseFilterSidebar searchParams={searchParams} />
              </Suspense>
            </aside>

            {/* Main Course Grid */}
            <div className="flex-1 min-w-0">
              <CourseListClientView>
                <Suspense fallback={<CourseCardSkeleton columns={3} rows={5} />}>
                  <CourseListWrapper searchParams={searchParams} />
                </Suspense>
              </CourseListClientView>
            </div>
          </div>
        </CourseFilterProvider>
      </div>
    </>
  );
};

export default CoursesPage;
