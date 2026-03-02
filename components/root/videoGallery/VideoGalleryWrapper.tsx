import {
  fetchPublicVideoGalleriesPage,
  SuccessStoryItem,
} from "@/apiServices/homePageService";
import VideoGalleryInfo from "./VideoGalleryInfo";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { PaginationType } from "@/types/pagination";

interface VideoGalleryWrapperProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VideoGalleryWrapper = async ({
  searchParams,
}: VideoGalleryWrapperProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 30,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let storyData;
  try {
    storyData = await fetchPublicVideoGalleriesPage({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message="An unknown error occurred while fetching video galleries." />
        </div>
      );
    }
  }
  const stories: SuccessStoryItem[] = storyData?.data?.video_galleries || [];
  const totalPages: PaginationType | undefined = storyData?.data?.pagination;
  if (stories?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-14">
        <NotFoundComponent
          message={storyData?.message || "No video galleries found"}
        />
      </div>
    );
  }
  return <VideoGalleryInfo stories={stories} totalPages={totalPages} />;
};

export default VideoGalleryWrapper;
