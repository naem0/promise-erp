import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import StoriesBannerWrapper from "@/components/root/success-stories/StoriesBannerWrapper";
import StoriesCard from "@/components/root/success-stories/StoriesCard";
import StoriesSectionSkeleton from "@/components/root/success-stories/StoriesSectionSkeleton";
import { Suspense } from "react";

interface SuccessStoriesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const SuccessStoriesPage = ({ searchParams }: SuccessStoriesPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <StoriesBannerWrapper />
      </Suspense>
      <Suspense fallback={<StoriesSectionSkeleton />}>
        <StoriesCard searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default SuccessStoriesPage;
