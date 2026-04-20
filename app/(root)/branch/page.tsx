import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import BannerWrapper from "@/components/root/Branche/BannerWrapper";
import BranchState from "@/components/root/Branche/BranchState";
import BranchStateSkeleton from "@/components/root/Branche/BranchStateSkeleton";

import BranchesClient from "@/components/root/Branche/BranchesClient";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

interface BranchesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BranchesPage = ({ searchParams }: BranchesPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <BannerWrapper />
      </Suspense>
      <Suspense fallback={<BranchStateSkeleton />}>
        <BranchState />
      </Suspense>
      <Suspense
        fallback={
          <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16 space-y-16 flex items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          </div>
        }
      >
        <BranchesClient searchParams={searchParams} />
      </Suspense>
    </>
  );
};
export default BranchesPage;
