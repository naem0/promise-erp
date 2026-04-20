import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner'
import ErrorComponent from '@/components/common/ErrorComponent';

const ImageGalleryBanner = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "image_gallery_banner" });
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
  const imageGalleryBanner = bannerData?.data?.sections;

  return (
    <CommonHeroBanner
      title={imageGalleryBanner[0]?.title || ""}
      subtitle={imageGalleryBanner[0]?.sub_title || ""}
      bgImage={imageGalleryBanner[0]?.image}
    />
  )
}

export default ImageGalleryBanner
