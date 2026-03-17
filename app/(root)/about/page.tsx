import AboutOpportunities from "@/components/root/about-us/AboutOpportunities";
import AboutSection from "@/components/root/about-us/AboutSection";
import CertificationsCarousel from "@/components/root/about-us/CertificationsCarousel";
import CompanyMission from "@/components/root/about-us/CompanyMission";
import OurAchievements from "@/components/root/about-us/OurAchievements";
import WhyChooseUs from "@/components/root/about-us/WhyChooseUs";
import WhyChooseUsSkeleton from "@/components/root/about-us/WhyChooseUsSkeleton";
import TeamMemberCardSkeleton from "@/components/root/ourOfficers/TeamMemberCardSkeleton";
import TeamMemberCardWrapper from "@/components/root/ourOfficers/TeamMemberCardWrapper";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Suspense } from "react";
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
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <WhyChooseUs />
        </Suspense>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <CompanyMission />
        </Suspense>
        <Suspense fallback={<WhyChooseUsSkeleton />}>
          <AboutOpportunities />
        </Suspense>
      </div>

      <Suspense fallback={<h1>Loading...</h1>}>
        <AboutSection />
      </Suspense>
      <div className="container mx-auto px-4">
          <CertificationsCarousel />
          
        <OurAchievements />
      </div>
    </>
  );
};

export default AboutPage;
