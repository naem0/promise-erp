"use client";

import { ReactNode } from "react";
import { useCourseFilter } from "./CourseFilterContext";
import CourseCardSkeleton from "@/components/common/CourseCardSkeleton";

export default function CourseListClientView({ children }: { children: ReactNode }) {
  const { isPending } = useCourseFilter();

  if (isPending) {
    return <CourseCardSkeleton columns={3} rows={5} />;
  }

  return <>{children}</>;
}
