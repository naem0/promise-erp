import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner'
import ErrorComponent from '@/components/common/ErrorComponent'

const NewsFeedsBannerWrapper = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "news_feed_banner" });
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
  const newsFeedsBanner = bannerData?.data?.sections;

  return (
    <CommonHeroBanner
      title={newsFeedsBanner[0]?.title || ""}
      subtitle={newsFeedsBanner[0]?.sub_title || ""}
      bgImage={newsFeedsBanner[0]?.image}
    />
  )
}

export default NewsFeedsBannerWrapper
