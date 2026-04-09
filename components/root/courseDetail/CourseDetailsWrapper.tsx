import { CertificateSection } from "@/components/root/courseDetail/CertificateSection";
import { CurriculumSection } from "@/components/root/courseDetail/CurriculumSection";
import { FAQSection } from "@/components/root/courseDetail/FAQSection";
import { HeroSection } from "@/components/root/courseDetail/HeroSection";
import { InstructorsSection } from "@/components/root/courseDetail/InstructorsSection";
import { ReviewsSection } from "@/components/root/courseDetail/ReviewsSection";
import SocialMediaSection from "@/components/root/courseDetail/SocialMediaSection";
import { ToolsSection } from "@/components/root/courseDetail/ToolsSection";
import { VideoSection } from "@/components/root/courseDetail/VideoSection";
import { WhatYouLearnSection } from "@/components/root/courseDetail/WhatYouLearnSection";
import { WhoCanJoinSection } from "@/components/root/courseDetail/WhoCanJoinSection";
import { ApiResponse, getCourseDetailBySlug } from "@/apiServices/courseDetailPublicService";

import { notFound } from "next/navigation";
import ErrorComponent from "@/components/common/ErrorComponent";
interface CourseDetailsWrapperProps {
  slug: string;
}

const CourseDetailsWrapper = async ({ slug }: CourseDetailsWrapperProps) => {
  let course;

  try {
    const response: ApiResponse | null = await getCourseDetailBySlug(slug);

    if (!response || !response.success || !response?.data) {
      notFound();
      return <ErrorComponent message="Failed to load course details." />;
    }

    course = response?.data || {};
  } catch (error) {
    console.error("Error loading course:", error);
    return <ErrorComponent message="Failed to load course details." />;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <HeroSection course={course} />
        <VideoSection course={course} />
        <WhatYouLearnSection course={course} />
        <CurriculumSection course={course} />
        <ToolsSection
          tools={course.course_tools || []}
          title={"Tools & Technologies You Will Master"}
        />
        <WhoCanJoinSection course={course} />
        <InstructorsSection 
          instructors={course.course_instructors} 
          title={"Meet Your Instructors"}
        />
        <ReviewsSection course={course} />
        <CertificateSection course={course} />
        <FAQSection course={course} />
        <SocialMediaSection />
      </div>
    </div>
  )
}

export default CourseDetailsWrapper
