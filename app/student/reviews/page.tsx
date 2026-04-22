import { Suspense } from "react";
import ReviewsListServer from "@/components/student-dashboard/reviews/ReviewsListServer";
import ReviewsListSkeleton from "@/components/student-dashboard/reviews/ReviewsListSkeleton";

export default function StudentReviewsPage() {
  return (
    <section className="px-4 py-8 md:py-12">
      <Suspense fallback={<ReviewsListSkeleton />}>
        <ReviewsListServer />
      </Suspense>
    </section>
  );
}
