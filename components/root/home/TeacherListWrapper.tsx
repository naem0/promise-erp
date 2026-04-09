import SectionTitle from "@/components/common/SectionTitle";
import TeacherListSection from "./TeacherListSection";
import { fetchAllPublicTeachers } from "@/apiServices/homePageService";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";

const TeacherListWrapper = async () => {
  "use cache";
  cacheTag("public-teachers");
  let teacherData;
  try {
     teacherData = await fetchAllPublicTeachers();
    
  } catch (error:unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public teachers:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!teacherData || !teacherData?.data || teacherData?.data?.teachers?.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={teacherData?.data?.section_title}
          subtitle={teacherData?.data?.section_subtitle}
          iswhite={false}
        />
        
          <TeacherListSection teacherData={teacherData} />
      </div>
    </section>
  );
};

export default TeacherListWrapper;
