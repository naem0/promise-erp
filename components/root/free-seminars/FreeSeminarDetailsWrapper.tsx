import FreeSeminarBanner from "@/components/root/free-seminars/FreeSeminarBanner";
import FreeSeminarContentSection from "@/components/root/free-seminars/FreeSeminarContentSection";
import FreeSeminarRelatedCoursesSection from "@/components/root/free-seminars/FreeSeminarRelatedCoursesSection";
import FreeSeminarSocialMediaSection from "@/components/root/free-seminars/FreeSeminarSocialMediaSection";
import { InstructorsSection } from "@/components/root/courseDetail/InstructorsSection";
import { getPublicFreeSeminarBySlug } from "@/apiServices/studentDashboardService";
import { notFound } from "next/navigation";
import ErrorComponent from "@/components/common/ErrorComponent";
import { ToolsSection } from "../courseDetail/ToolsSection";

interface FreeSeminarDetailsWrapperProps {
  slug: string;
}

const FreeSeminarDetailsWrapper = async ({
  slug,
}: FreeSeminarDetailsWrapperProps) => {
  let seminar = null;

  try {
    const constseminarRes = await getPublicFreeSeminarBySlug(slug);

    if (!constseminarRes || !constseminarRes.success || !constseminarRes?.data) {
      return null
    }

    seminar = constseminarRes?.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message="An unknown error occurred." />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <FreeSeminarBanner seminar={seminar} />
        <FreeSeminarContentSection seminar={seminar} />
        <div className="mt-12 mb-20">
          <ToolsSection
            tools={seminar?.tools || []}
            title={"Tools & Technologies You Will Master"}
          />
        </div>
        <div className="mb-20">
          <InstructorsSection
            instructors={seminar?.instructors || []}
            title={"Meet Your Instructors"}
          />
        </div>
      </div>
      <FreeSeminarRelatedCoursesSection coursesData={seminar?.courses} />
      <div className="container mx-auto py-10 px-4 md:px-6">
        <FreeSeminarSocialMediaSection />
      </div>
    </div>
  );
};

export default FreeSeminarDetailsWrapper;
