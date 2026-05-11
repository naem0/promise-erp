import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import HighlightsSkeleton from "@/components/common/HighlightsSkeleton";
import HighlightsSection from "@/components/root/home/HighlightsSection";
import TrainerItemWrapper from "@/components/root/trainers/TrainerItemWrapper";
import TrainerSkeletonGrid from "@/components/root/trainers/TrainerSkeletonGrid";
import TrainerWrapperHeroBanner from "@/components/root/trainers/TrainerWrapperHeroBanner";
import { Suspense } from "react";

interface TrainersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const TrainersPage = ({ searchParams }: TrainersPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <TrainerWrapperHeroBanner />
      </Suspense>
      <div className="container mx-auto px-4">
        <Suspense fallback={<HighlightsSkeleton />}>
          <HighlightsSection />
        </Suspense>
        <Suspense fallback={<TrainerSkeletonGrid />}>
          <TrainerItemWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
};

export default TrainersPage;
