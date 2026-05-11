import { Suspense } from "react";
import CourseCardSkeleton from "@/components/common/CourseCardSkeleton";
import CourseFilterSidebar from "@/components/root/courseList/CourseFilterSidebar";
import HeaderBanner from "@/components/root/courseList/HeaderBanner";
import CourseListWrapper from "@/components/root/courseList/CourseListWrapper";
import { Card } from "@/components/ui/card";
import CourseFilterSkeleton from "@/components/root/courseList/CourseFilterSkeleton";
import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const CoursesPage = ({ searchParams }: CoursesPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <HeaderBanner />
      </Suspense>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <Card className="py-2 px-2 mb-4 md:mb-4">
          <h2 className="text-2xl md:text-4xl text-center capitalize font-bold text-secondary ">
            All Courses
          </h2>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <Suspense fallback={<CourseFilterSkeleton />}>
              <CourseFilterSidebar searchParams={searchParams} />
            </Suspense>
          </aside>

          <div className="flex-1">
            <Suspense fallback={<CourseCardSkeleton columns={3} rows={5} />}>
              <CourseListWrapper searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesPage;
