import PartnerSkeleton from "@/components/common/PartnerSkeleton";
import AboutOpportunities from "@/components/root/about-us/AboutOpportunities";
import AboutSection from "@/components/root/about-us/AboutSection";
import CertificationsCarousel from "@/components/root/about-us/CertificationsCarousel";
import CompanyMission from "@/components/root/about-us/CompanyMission";
import OurAchievementsWrapper from "@/components/root/about-us/OurAchievementsWrapper";
import WhyChooseUs from "@/components/root/about-us/WhyChooseUs";
import WhyChooseUsSkeleton from "@/components/root/about-us/WhyChooseUsSkeleton";
import TeamMemberCardSkeleton from "@/components/root/ourOfficers/TeamMemberCardSkeleton";
import TeamMemberCardWrapper from "@/components/root/ourOfficers/TeamMemberCardWrapper";
import AffiliatesAndClients from "@/components/root/home/AffiliatesAndClients";
import { Suspense } from "react";
import AboutBranch from "@/components/root/about-us/AboutBranch";
import CertificateSkeleton from "@/components/root/about-us/CertificateSkeleton";
const AboutPage = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <section className="py-10 md:py-12">
          <div className="max-w-full lg:max-w-6xl mx-auto">
            <Suspense fallback={<TeamMemberCardSkeleton />}>
              <TeamMemberCardWrapper />
            </Suspense>
          </div>
        </section>
        <OurAchievementsWrapper />

        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <CompanyMission />
        </Suspense>
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <AboutSection />
      </Suspense>

      <div className="container mx-auto px-4">
        <Suspense
          fallback={
            <div className="grid xl:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <CertificateSkeleton key={i} />
              ))}
            </div>
          }
        >
          <CertificationsCarousel />
        </Suspense>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <WhyChooseUs />
        </Suspense>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <AboutOpportunities />
        </Suspense>
        <AboutBranch />
      </div>
      <Suspense fallback={<PartnerSkeleton />}>
        <AffiliatesAndClients />
      </Suspense>
    </>
  );
};

export default AboutPage;
