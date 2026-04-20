import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";
import VideoGalleryBanner from "@/components/root/videoGallery/VideoGalleryBanner";
import VideoGallerySkeleton from "@/components/root/videoGallery/VideoGallerySkeleton";
import VideoGalleryWrapper from "@/components/root/videoGallery/VideoGalleryWrapper";
import { Suspense } from "react";

interface VideoGalleryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const VideoGalleryPage = ({ searchParams }: VideoGalleryPageProps) => {
  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <VideoGalleryBanner />
      </Suspense>
      <Suspense fallback={<VideoGallerySkeleton />}>
        <VideoGalleryWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default VideoGalleryPage;
