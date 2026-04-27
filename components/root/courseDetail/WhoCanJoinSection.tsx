import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CourseDetail } from "@/apiServices/courseDetailPublicService";

interface WhoCanJoinSectionProps {
  course: CourseDetail;
}

export const WhoCanJoinSection = ({ course }: WhoCanJoinSectionProps) => {
  if (course.course_joins?.length === 0) return null;
  return (
    <Card className="bg-muted/30 py-0">
      <CardContent className="p-4 lg:p-8">
        <h2 className="text-xl lg:text-3xl font-bold text-center mb-4 lg:mb-8 animate-in fade-in duration-500">Who Can Join</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.course_joins?.map((point, index) => (
            <div
              key={point.id || index}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-medium">{point.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
};
