import { getStudentReviews, StudentReview, StudentReviewsApiResponse } from "@/apiServices/studentDashboardService";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import ReviewCard from "./ReviewCard";
import AddReviewButton from "./AddReviewButton";
import ErrorComponent from "@/components/common/ErrorComponent";


export default async function ReviewsListServer() {
  let reviews: StudentReview[];
  let response: StudentReviewsApiResponse | null;

  try {
    response = await getStudentReviews({ params: { per_page: 30, page: 1 } });
    reviews = response?.data?.reviews ?? [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <div className="w-full h-full flex flex-col items-center justify-center">
        <ErrorComponent message={error.message ?? "Something went wrong!"} />
      </div>
    } else {
      return <div className="w-full h-full flex flex-col items-center justify-center">
        <ErrorComponent message="An unknown error occurred!" />
      </div>
    }
  }

  if (!response || !response?.data || !reviews) {
    return null
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-secondary">Reviews</h2>
        <AddReviewButton />
      </div>

      {reviews?.length === 0 ? (
        <NotFoundComponent
          message={response?.message ?? "No reviews found. Click the button above to add one!"}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {reviews?.map((review) => (
            <ReviewCard
              key={review?.id}
              review={review}
            />
          ))}
        </div>
      )}
    </div>
  );
}
