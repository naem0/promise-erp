import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner';
import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import ErrorComponent from '@/components/common/ErrorComponent';

const BloggCategoryWrapperBanner =async () => {
 let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "blog_category_banner" });
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
  const branchBanner = bannerData?.data?.sections;
  return (
    <CommonHeroBanner
      title={branchBanner[0]?.title}
      subtitle={branchBanner[0]?.sub_title}
      bgImage={branchBanner[0]?.image}
    />
  )
}

export default BloggCategoryWrapperBanner
