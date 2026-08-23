import {
  CategoriesResponse,
  getHomeCourseCategories,
} from "@/apiServices/categoryService";
import CourseCategoriesSection from "./CourseCategoriesSection";
import SectionTitle from "@/components/common/SectionTitle";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const CourseCategoriesWrapper = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORIES);

  let categoriesData: CategoriesResponse | null = null;
  try {
    categoriesData = await getHomeCourseCategories();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching course categories:", error.message);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={"An unknown error occurred."} />
        </div>
      );
    }
  }

  if (!categoriesData || !categoriesData?.data || categoriesData?.data?.categories?.length === 0) {
    return null;
  }

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
