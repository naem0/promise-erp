import { Card, CardContent } from "@/components/ui/card";
import { CourseDetail } from "@/apiServices/courseDetailPublicService";
import ReviewCard from "@/components/common/web-common/ReviewCard";

const AVATAR_PLACEHOLDER = "https://placehold.co/40x40/4f46e5/ffffff/png?text=U";

interface ReviewsSectionProps {
  course: CourseDetail;
}

export const ReviewsSection = ({ course }: ReviewsSectionProps) => {
  const reviews = course.reviews || [];

  if (reviews.length === 0) return null;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-500">Student Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
