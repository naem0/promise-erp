import StoriesCardItems from "./StoriesCardItems";
import ErrorComponent from "@/components/common/ErrorComponent";
import { fetchPublicFeaturedReviews } from "@/apiServices/homePageService";
import Pagination from "@/components/common/Pagination";
import { PaginationType } from "@/types/pagination";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface StoriesCardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const StoriesCard = async ({ searchParams }: StoriesCardProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 30,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let storiesData;
  try {
    storiesData = await fetchPublicFeaturedReviews(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message="An unknown error occurred while fetching video galleries." />
        </div>
      );
    }
  }

  const testimonials = storiesData?.data?.reviews || [];
  const totalPages: PaginationType | undefined = storiesData?.data?.pagination;
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.length > 0 ? (
            testimonials.map((item) => (
              <StoriesCardItems key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-2">
              <NotFoundComponent
                message={storiesData?.message || "No reviews found"}
              />
            </div>
          )}
        </div>
        {totalPages && totalPages.per_page > 30 && (
          <div className="mt-6">
            <Pagination pagination={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesCard;
