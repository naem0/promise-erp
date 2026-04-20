import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import JobCircularJoinUs from "@/components/root/jobCirculars/JobCircularJoinUs";
import JobCircularWrapper from "@/components/root/jobCirculars/JobCircularWrapper";
import JobWrapperHeroBanner from "@/components/root/jobCirculars/JobWrapperHeroBanner";
import { Suspense } from "react";

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const JobCircularsPage = ({ searchParams }: SearchParamsProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <JobWrapperHeroBanner />
      </Suspense>
      <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse rounded-xl" />}>
        <JobCircularWrapper searchParams={searchParams} />
      </Suspense>
      <JobCircularJoinUs />
    </>
  );
};

export default JobCircularsPage;
