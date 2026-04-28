"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getStudentMyCourses,
  StudentMyCourse,
} from "@/apiServices/studentDashboardService";
import MyCourseCard from "./MyCourseCard";
import ErrorComponent from "../common/ErrorComponent";
import NotFoundComponent from "../common/NotFoundComponent";
import { useSession } from "next-auth/react";
import MyCourseSkeleton from "@/components/student-dashboard/MyCourseSkeleton";

const MyCoursesGrid = () => {
  const [courses, setCourses] = useState<StudentMyCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUpdatedCourse, setIsUpdatedCourse] = useState<boolean>(false);

  const { data: session } = useSession();
  const token = session?.accessToken as string;

  useEffect(() => {
    if (!token) return;
    const fetchCourses = async () => {
      startTransition(async () => {
        try {
          const params = {
            per_page: 20,
            page: 1,
          };

          const response = await getStudentMyCourses(token, { params });

          if (!response || !response.success || !response.data) {
            setError(response?.message || "Something went wrong");
            return;
          }

          const data = response?.data?.courses || [];
          setCourses(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Failed to fetch courses");
          }
        }
      });
    };

    fetchCourses();
  }, [token, isUpdatedCourse]);

  if (isPending) {
    return (
      <div className="py-10">
        <MyCourseSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorComponent message={error} />
      </div>
    );
  }

  if (!courses.length) {
    return (
      <NotFoundComponent message="My courses not found" title="My Courses" />
    );
  }

  return (
    <section className="py-8 lg:py-14 px-4">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
        {courses?.map((course) => (
          <MyCourseCard
            key={course?.id}
            course={course}
            isUpdatedCourse={isUpdatedCourse}
            setIsUpdatedCourse={setIsUpdatedCourse}
          />
        ))}
      </div>
    </section>
  );
};

export default MyCoursesGrid;
