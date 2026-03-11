"use client";

import { LessonNavigation } from "@/apiServices/studentDashboardService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  navigation: LessonNavigation;
}

const MyCourseBySlugNavigationBtn = ({
  navigation,
}: NavigationButtonsProps) => {
  const { slug } = useParams<{ slug: string }>();

  const { previous_lesson, next_lesson } = navigation;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="">
        {next_lesson ? (
          <p className="text-secondary text-base">{next_lesson?.title}</p>
        ) : (
          <p className="text-secondary text-base">{previous_lesson?.title}</p>
        )}
      </div>
      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {/* Previous */}
        {previous_lesson ? (
          <Button asChild>
            <Link
              href={`/student/mycourses/${slug}?lesson_id=${previous_lesson?.id}&batch_id=${navigation?.batch?.id}`}
            >
              Previous
            </Link>
          </Button>
        ) : (
          <Button disabled className="bg-red-600 text-white">
            Previous
          </Button>
        )}

        {/* Next */}
        {next_lesson ? (
          <Button asChild>
            <Link
              href={`/student/mycourses/${slug}?lesson_id=${next_lesson.id}&batch_id=${navigation?.batch?.id}`}
              className="nav-button nav-button-primary hover:bg-primary/90 transition-colors"
            >
              Next
            </Link>
          </Button>
        ) : (
          <Button disabled className="bg-red-600 text-white">
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default MyCourseBySlugNavigationBtn;
