import HighlightsSection from "@/components/root/home/HighlightsSection";
import HomeServiceList from "@/components/root/home/HomeServiceList";
import GettingOpportunity from "@/components/root/home/GettingOpportunity";
import CareerDevelopmentBlog from "@/components/root/home/CareerDevelopmentBlog";
import NewsfeedsArchive from "@/components/root/home/NewsfeedsArchive";
import NewsletterSection from "@/components/root/home/NewsletterSection";
import VideoStories from "@/components/root/home/VideoStories";
import { Suspense } from "react";
import HomeHeroSkeleton from "@/components/common/HomeHeroSkeleton";
import HomeHeroWrapper from "@/components/root/home/HomeHeroWrapper";
import HighlightsSkeleton from "@/components/common/HighlightsSkeleton";
import CourseCategoriesWrapper from "@/components/root/home/CourseCategoriesWrapper";
import OurBranchesWrapper from "@/components/root/home/OurBranchesWrapper";
import HomeCoursesWrapper from "@/components/root/home/HomeCoursesWrapper";
import TeacherListWrapper from "@/components/root/home/TeacherListWrapper";
import StudentSuccessWrapper from "@/components/root/home/StudentSuccessWrapper";
import BranchesSkeleton from "@/components/common/BranchesSkeleton";
import HomeGovtCourse from "@/components/root/home/HomeGovtCourse";
import CourseCategorySkeleton from "@/components/common/CourseCategorySkeleton";
import ServicesSkeleton from "@/components/common/ServicesSkeleton";
import HomeCourseSkeleton from "@/components/common/HomeCourseSkeleton";
import GovtCourseSkeleton from "@/components/common/GovtCourseSkeleton";
import OpportunitySkeletone from "@/components/common/OpportunitySkeletone";
import VideoStorySkeleton from "@/components/common/VideoStorySkeleton";
import BlogSkeleton from "@/components/common/BlogSkeleton";
import TeacherListSkeleton from "@/components/common/TeacherListSkeleton";
import StudentSuccessSkeleton from "@/components/common/StudentSuccessSkeleton";
import NewsfeedsArchiveSkeleton from "@/components/common/NewsfeedsArchiveSkeleton";
import NewsletterSkeleton from "@/components/common/NewsletterSkeleton";
import HomeMembersSection from "@/components/root/home/HomeMembersSection";
import HomeMemberSkeleton from "@/components/root/home/HomeMemberSkeleton";

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeHeroWrapper />
      </Suspense>
      <Suspense fallback={<HighlightsSkeleton />}>
        <HighlightsSection />
      </Suspense>
      <Suspense fallback={<CourseCategorySkeleton />}>
        <CourseCategoriesWrapper />
      </Suspense>
      <Suspense fallback={<HomeCourseSkeleton />}>
        <HomeCoursesWrapper />
      </Suspense>
      <Suspense fallback={<ServicesSkeleton />}>
        <HomeServiceList />
      </Suspense>
      <Suspense fallback={<GovtCourseSkeleton />}>
        <HomeGovtCourse />
      </Suspense>
      <Suspense fallback={<OpportunitySkeletone />}>
        <GettingOpportunity />
      </Suspense>
      <Suspense fallback={<TeacherListSkeleton />}>
        <TeacherListWrapper />
      </Suspense>
      <Suspense fallback={<VideoStorySkeleton />}>
        <VideoStories />
      </Suspense>
      <Suspense fallback={<StudentSuccessSkeleton />}>
        <StudentSuccessWrapper />
      </Suspense>
      <Suspense fallback={<BlogSkeleton />}>
        <CareerDevelopmentBlog />
      </Suspense>
      <Suspense fallback={<NewsfeedsArchiveSkeleton />}>
        <NewsfeedsArchive />
      </Suspense>
      <Suspense fallback={<HomeMemberSkeleton />}>
        <HomeMembersSection />
      </Suspense>
      <Suspense fallback={<BranchesSkeleton />}>
        <OurBranchesWrapper />
      </Suspense>
      <Suspense fallback={<NewsletterSkeleton />}>
        <NewsletterSection />
      </Suspense>
    </>
  );
};

export default HomePage;
