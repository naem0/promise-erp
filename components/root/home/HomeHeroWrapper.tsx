import { getLatestHeroSection, HeroSectionResponse } from "@/apiServices/homePageService";
import HomeHeroSection from "./HomeHeroSection";
import { cacheTag, cacheLife } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

const fallbackHeroData: HeroSectionResponse = {
  success: true,
  message: "Fallback",
  code: 200,
  data: {
    id: 1,
    title: "Best Freelancing IT Training Institute In Bangladesh",
    subtitle: "Transform your IT potential into global earnings. Master in-demand IT skills at Bangladesh's top freelancing institute and launch your global career from your hometown.",
    button_text_one: "Browse Courses",
    button_link_one: "/courses",
    button_text_two: "Free Seminars",
    button_link_two: "/free-seminars",
    background_image: "/images/home/hero-banner.webp",
    video_url: "https://youtu.be/DeRVmBh0oG8?si=_tjmWhyhs7nBQC64"
  }
};

const HomeHeroWrapper = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.HERO_SECTIONS);
  cacheLife("minutes");

  let heroBannerData: HeroSectionResponse | null = null;
  try {
    heroBannerData = await getLatestHeroSection();
  } catch (error: unknown) {
    console.error("Error fetching hero banner:", error);
    heroBannerData = fallbackHeroData;
  }

  return <HomeHeroSection heroBannerData={heroBannerData || fallbackHeroData} />;
};

export default HomeHeroWrapper;
