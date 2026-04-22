import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import EmployeeCategory from "@/components/root/ourOfficers/EmployeeCategory";
import WrapperHeroBanner from "@/components/root/ourOfficers/WrapperHeroBanner";
import TeamMemberCardWrapper from "@/components/root/ourOfficers/TeamMemberCardWrapper";
import GeneralTeamMemberCard from "@/components/root/ourOfficers/GeneralTeamMemberCard";
import { Suspense } from "react";
import TeamMemberCardSkeleton from "@/components/root/ourOfficers/TeamMemberCardSkeleton";
import { Spinner } from "@/components/ui/spinner";

const OurOfficersPage = () => {
  return (
    <section className="w-full">
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <WrapperHeroBanner />
      </Suspense>

      <div className="container mx-auto px-4">
        <EmployeeCategory />

        <div className="mx-auto max-w-5xl mb-10">
          <Suspense fallback={<TeamMemberCardSkeleton />}>
            <TeamMemberCardWrapper isAbout={false} />
          </Suspense>
        </div>
        <div className="">
          <Suspense
            fallback={
              <div className="flex min-h-80 items-center justify-center">
                <div className="flex items-center gap-4">
                  <Spinner className="size-8" />
                </div>
              </div>
            }
          >
            <GeneralTeamMemberCard />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default OurOfficersPage;
