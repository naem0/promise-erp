import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner';
import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import ErrorComponent from '@/components/common/ErrorComponent';

const BloggWrapperBanner = async () => {
  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "blog_banner" });
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
    <CommonHeroBanner
      title={branchBanner[0]?.title}
      subtitle={branchBanner[0]?.sub_title}
      bgImage={branchBanner[0]?.image}
    />
  )
}

export default BloggWrapperBanner
