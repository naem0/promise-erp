import { CategoriesResponse, getHomeCourseCategories } from "@/apiServices/categoryService";
import CourseCategoriesSection from "./CourseCategoriesSection";
import SectionTitle from "@/components/common/SectionTitle";
import { cacheTag } from "next/cache";

const CourseCategoriesWrapper = async () => {
  "use cache";
  cacheTag("categories-list");

  const categoriesData: CategoriesResponse = await getHomeCourseCategories();

  return (
    <section className="bg-secondary py-8 lg:py-14">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={categoriesData?.data?.section_title}
          subtitle={categoriesData?.data?.section_subtitle}
          iswhite={true}
        />

        <CourseCategoriesSection categoriesData={categoriesData} />
      </div>
    </section>
  );
};

export default CourseCategoriesWrapper;
