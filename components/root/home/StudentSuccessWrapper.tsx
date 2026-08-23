import SectionTitle from "@/components/common/SectionTitle";
import StudentSuccessStories from "./StudentSuccessStories";
import { fetchPublicFeaturedReviews } from "@/apiServices/homePageService";
import Image from "next/image";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const StudentSuccessWrapper = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.REVIEWS);
  let reviewsData;
  try {
    reviewsData = await fetchPublicFeaturedReviews();
  } catch (error: unknown) {
    console.error("Error fetching public reviews:", error);
    if (error instanceof Error) {
      console.error("Error fetching public reviews:", error.message);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={error.message} />
        </div>
      );
    }else {
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  if (!reviewsData || !reviewsData?.data || !reviewsData?.data?.reviews || reviewsData?.data?.reviews?.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-14 min-h-[600px] relative">
      {/* Background Image - Optimized */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/success-story-bg.webp"
          alt="Success story background"
          fill
          quality={80}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4">
        <SectionTitle
          title={reviewsData?.data?.section_title}
          subtitle={reviewsData?.data?.section_subtitle}
          iswhite={false}
        />

        <StudentSuccessStories reviewsData={reviewsData} />
      </div>
    </section>
  );
};

export default StudentSuccessWrapper;
