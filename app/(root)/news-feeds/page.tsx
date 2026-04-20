import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import NewsFeedsBannerWrapper from "@/components/root/news-feeds/NewsFeedsBannerWrapper";
import NewsFeedsCard from "@/components/root/news-feeds/NewsFeedsCard";
import StoriesSectionSkeleton from "@/components/root/success-stories/StoriesSectionSkeleton";
import { Suspense } from "react";

interface NewFeedsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const NewsFeedsPage = async ({ searchParams }: NewFeedsPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <NewsFeedsBannerWrapper />
      </Suspense>
      <Suspense fallback={<StoriesSectionSkeleton />}>
        <NewsFeedsCard searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default NewsFeedsPage;
