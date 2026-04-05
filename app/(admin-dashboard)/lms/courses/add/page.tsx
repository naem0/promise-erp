import { Suspense } from "react";
import CourseCreationWizard from "@/components/lms/courses/CourseCreationWizard";

export default function AddCoursePage() {
  return (
    <div className="py-10">
      <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse rounded-xl" />}>
        <CourseCreationWizard />
      </Suspense>
    </div>
  );
}
