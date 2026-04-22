import { fetchPublicNewsFeeds } from "@/apiServices/homePageService";
import NewsFeedsCardItems from "./NewsFeedsCardItems";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";

interface NewFeedsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const NewsFeedsCard = async ({ searchParams }: NewFeedsPageProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 30,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let newsData;
  try {
    newsData = await fetchPublicNewsFeeds(params);
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
          <ErrorComponent message="An unknown error occurred while fetching news feeds." />
        </div>
      );
    }
  }
  const newsItems = newsData?.data?.news_feeds || [];
  const totalPage = newsData?.data?.pagination || null;
  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {newsItems.length > 0 ? (
            newsItems.map((item) => (
              <NewsFeedsCardItems key={item?.id} item={item} />
            ))
          ) : (
            <div className="col-span-full">
              <NotFoundComponent
                message={newsData?.message || "No news feeds found"}
              />
            </div>
          )}
        </div>
        {totalPage && totalPage.per_page > 28 && (
          <div className="flex justify-center mt-8">
            <Pagination pagination={totalPage} />
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeedsCard;
