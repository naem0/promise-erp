"use client";
import SectionTitle from "@/components/common/SectionTitle";
import HomeCourses from "./HomeCourses";
import {
  ApiResponse,
  getPublicCoursesList,
} from "@/apiServices/courseListPublicService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import HomeCourseSkeleton from "@/components/common/HomeCourseSkeleton";

const HomeCoursesWrapper = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [coursesData, setCoursesData] = useState<ApiResponse | null>(null);
  const branchId = searchParams.get("branch_id") ?? "1";

  useEffect(() => {
    startTransition(() => {
      const fetchCourses = async () => {
        try {
          const params = {
            per_page: 16,
            sort_order: searchParams.get("sort_order") ?? "desc",
            branch_id: branchId,
            sort_ratings: searchParams.get("sort_ratings") ?? "ratings",
            page: searchParams.get("page")
              ? Number(searchParams.get("page"))
              : 1,
          };

          const res = await getPublicCoursesList(params);
          if (res?.success) {
            setCoursesData(res ?? null);
          } else {
            console.error("Failed to fetch public courses:", res?.message);
          }
        } catch (error) {
          console.error("Failed to fetch public courses:", error);
          setCoursesData(null);
        }
      };

      fetchCourses();
    });
  }, [branchId]);

  if (isPending) {
    return <HomeCourseSkeleton />;
  }

  if (!coursesData || !coursesData?.data || !coursesData?.success) {
    return null;
  }

  return (
    <section className="bg-white py-8 md:py-14">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={coursesData?.data?.section_title}
          subtitle={coursesData?.data?.section_subtitle}
          iswhite={false}
        />
        <HomeCourses coursesData={coursesData} branchId={branchId} />
      </div>
    </section>
  );
};

export default HomeCoursesWrapper;
