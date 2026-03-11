// components/student-dashboard/MyCourseBySlugCourseModule.tsx

import { CheckCircle, FileText, Video } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { CourseModuleLessonItem, getStudentCourseModulesList } from "@/apiServices/studentDashboardService";

interface MyCourseBySlugCourseModuleProps {
  slug: string;
  currentLessonId?: number;
  batchId?: number
}

const MyCourseBySlugCourseModule = async ({
  slug,
  currentLessonId,
  batchId
}: MyCourseBySlugCourseModuleProps) => {
  const response = await getStudentCourseModulesList(slug);
  const modules = response?.data?.course_modules || [];

  if (modules.length === 0) {
    return <div>Module not available for this course</div>;
  }

  const getLessonIcon = (lesson: CourseModuleLessonItem) => {
    return lesson?.type === 1 ? (
      <Video className="w-5 h-5" />
    ) : lesson?.type === 0 ? (
      <FileText className="w-5 h-5" />
    ) : null;
  };

  const activeModule = modules.find((module) =>
    module.lessons.some((lesson) => lesson.id === currentLessonId)
  );

  return (
    <div className="overflow-hidden border border-border rounded-lg bg-card">
      <div className="bg-secondary p-4 border-b border-border">
        <h3 className="font-semibold text-white">Course Module</h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <Accordion
          key={activeModule?.id || "default"}
          type="single"
          collapsible
          className="w-full"
          defaultValue={activeModule?.title}
        >
          {modules.map((module, index) => (
            <AccordionItem
              key={module.id}
              value={module.title}
              className="border-b border-border/50 last:border-b-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-white data-[state=open]:bg-white cursor-pointer">
                <div className="flex items-start gap-3 text-left cursor-pointer">
                  <span className="text-secondary text-base font-medium">
                    {index + 1}
                  </span>
                  <span className="text-base font-medium text-secondary">
                    {module.title}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0">
                <div className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <Link
                      key={lesson?.id}
                      href={`/student/mycourses/${slug}?lesson_id=${lesson?.id}&batch_id=${batchId}`}
                      className={`flex items-start gap-3 p-3 transition-colors ${currentLessonId === lesson?.id
                        ? " bg-secondary border-l-3 border-primary text-white"
                        : "bg-secondary/90 text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {getLessonIcon(lesson)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-white">{lesson.title}</p>
                            {lesson?.is_completed && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          {lesson.duration && (
                            <p className="text-xs text-white mt-0.5">
                              {lesson.duration} min
                            </p>
                          )}
                        </div>
                      </div>
                      {currentLessonId === lesson.id && (
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      )}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default MyCourseBySlugCourseModule;
