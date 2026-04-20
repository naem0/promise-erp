import ReviewsList from "@/components/student-dashboard/reviews/ReviewsList";

export const metadata = {
  title: "My Reviews | Promise ERP",
  description: "View and manage your course reviews.",
};

export default function StudentReviewsPage() {
  return (
    <section className="px-4 py-8 md:py-12 px-4">
      <div className="px-4">
        <ReviewsList />
      </div>
    </section>
  );
}
