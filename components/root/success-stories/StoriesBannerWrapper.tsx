import CommonHeroBanner from "@/components/common/CommonHeroBanner";
import { fetchCommonBannerSectionData } from "@/apiServices/webAllPageBanner";
import ErrorComponent from "@/components/common/ErrorComponent";

const StoriesBannerWrapper = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "success_story_banner" });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      return <ErrorComponent message={bannerData?.message || "Failed to fetch banner data"} />;
    } else {
      return <ErrorComponent message="Failed to fetch banner data" />;
    }
  }
  if (!bannerData?.success || !bannerData?.data) {
    return null;
  }
  const successStoriesBanner = bannerData?.data?.sections;

  return (
    <CommonHeroBanner
      title={successStoriesBanner[0]?.title || ""}
      subtitle={successStoriesBanner[0]?.sub_title || ""}
      bgImage={successStoriesBanner[0]?.image}
    />
  );
};

export default StoriesBannerWrapper;
