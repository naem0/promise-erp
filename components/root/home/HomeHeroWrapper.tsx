import { getLatestHeroSection } from "@/apiServices/homePageService";
import HomeHeroSection from "./HomeHeroSection";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";
const HomeHeroWrapper = async () => {
  "use cache";
  cacheTag("hero-sections-list");
  let heroBannerData;
  try {
    heroBannerData = await getLatestHeroSection();
  } catch (error: unknown) {
    console.error("Error fetching hero banner:", error);
    if (error instanceof Error) {
      console.error("Error fetching hero banner:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }
  if (!heroBannerData) {
    return null;
  }

  return <HomeHeroSection heroBannerData={heroBannerData} />;
};

export default HomeHeroWrapper;
