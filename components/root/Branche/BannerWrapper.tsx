import CommonHeroBanner from '@/components/common/CommonHeroBanner'
import { fetchCommonBannerSectionData } from '@/apiServices/webAllPageBanner'
import ErrorComponent from '@/components/common/ErrorComponent';

const BannerWrapper = async () => {

  let bannerData
  try {
    bannerData = await fetchCommonBannerSectionData({ type: "branch_banner" });
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
        title={branchBanner[0]?.title || ""}
        subtitle={branchBanner[0]?.sub_title || ""}
        bgImage={branchBanner[0]?.image}
      />
    </>
  )
}

export default BannerWrapper
