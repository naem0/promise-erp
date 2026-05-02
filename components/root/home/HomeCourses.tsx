"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import CourseCard from "../courseList/CourseCard";
import { ApiResponse, Course } from "@/apiServices/courseListPublicService";
import { PublicCourse } from "@/apiServices/studentDashboardService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface HomeCoursesProps {
  coursesData?: ApiResponse | null;
  courses?: Course[] | PublicCourse[];
  branchId?: string;
}

const HomeCourses = ({ coursesData, courses: directCourses, branchId }: HomeCoursesProps) => {
  const courses = directCourses || coursesData?.data?.courses || [];

  if (courses?.length === 0) {
    return <NotFoundComponent message={coursesData?.message || "No Courses Found"} />;
  }

  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    })
  );

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-full relative"
      >
        <CarouselContent className="py-4">
          {courses.map((course) => (
            <CarouselItem
              key={course.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-auto"
            >
              <CourseCard course={course} branchId={branchId} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows inside container */}
        <CarouselPrevious className=" absolute cursor-pointer left-0 md:-left-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none " />
        <CarouselNext className="absolute cursor-pointer right-0 md:-right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none" />
      </Carousel>
      <div className="pt-6 flex items-center justify-center">
        <Button asChild className="cursor-pointer flex items-center gap-2" variant="secondary">
          <Link href="/courses">
            সব কোর্স দেখুন
          </Link>
        </Button>
      </div>
    </>
  );
};

export default HomeCourses;
