import CommonHeroBanner from "@/components/common/CommonHeroBanner"
import { fetchCommonBannerSectionData } from "@/apiServices/webAllPageBanner"
import ErrorComponent from "@/components/common/ErrorComponent"

const VideoGalleryBanner = async() => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "video_gallery_banner" });
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
  const videoGalleryBanner = bannerData?.data?.sections;
  
  return (
    <CommonHeroBanner
      title={videoGalleryBanner[0]?.title || ""}
      subtitle={videoGalleryBanner[0]?.sub_title || ""}
      bgImage={videoGalleryBanner[0]?.image}
    />
  )
}

export default VideoGalleryBanner
