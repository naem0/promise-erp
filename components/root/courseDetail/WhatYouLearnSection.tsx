import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CourseDetail } from "@/apiServices/courseDetailPublicService";

interface WhatYouLearnSectionProps {
  course: CourseDetail;
}

export const WhatYouLearnSection = ({ course }: WhatYouLearnSectionProps) => {
  const learningPoints = course.course_learnings || [];

  if (learningPoints.length === 0) return null;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-8">
        <h2 className="text-xl lg:text-3xl font-bold text-center mb-8 animate-in fade-in duration-500">What You{"'"}ll Learn in This Course</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {learningPoints.map((point, index) => (
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
  );
};
