import { fetchCommonBannerSectionData } from "@/apiServices/webAllPageBanner";
import CommonHeroBanner from "@/components/common/CommonHeroBanner";
import ErrorComponent from "@/components/common/ErrorComponent";

const HeaderBanner = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "course_category_banner" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={bannerData?.message || "Failed to fetch banner data"} />;
    } else {
      return <ErrorComponent message="Failed to fetch banner data" />;
    }
  }
  if (!bannerData?.success || !bannerData?.data) {
    return null;
  }
  const branchBanner = bannerData?.data?.sections;
  return (
    <>
      <CommonHeroBanner
        title={bannerData?.data?.sections?.[0]?.title}
        subtitle={bannerData?.data?.sections?.[0]?.sub_title}
        bgImage={bannerData?.data?.sections?.[0]?.image}
      />
    </>
  );
};

export default HeaderBanner;
