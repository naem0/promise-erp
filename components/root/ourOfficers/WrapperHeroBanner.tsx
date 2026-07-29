import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner'
import ErrorComponent from '@/components/common/ErrorComponent'

const WrapperHeroBanner = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "our_officers_banner" });
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
  const officerBanner = bannerData?.data?.sections;

  return (
    <CommonHeroBanner
      title={officerBanner[0]?.title || ""}
      subtitle={officerBanner[0]?.sub_title || ""}
      bgImage={officerBanner[0]?.image}
    />
  )
}

export default WrapperHeroBanner
