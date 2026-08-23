import {
  fetchPublicVideoGalleries,
  SuccessStoryItem,
} from "@/apiServices/homePageService";
import SectionTitle from "@/components/common/SectionTitle";
import { cacheTag } from "next/cache";
import VideoStoriesCard from "./VideoStoriesCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const VideoStories = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.VIDEO_GALLERIES);
  let storyData;
  try {
    storyData = await fetchPublicVideoGalleries();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public video galleries:", error.message);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      console.error("Error fetching public video galleries:", error);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  const stories: SuccessStoryItem[] = storyData?.data?.video_galleries || [];

  if (!storyData || !storyData?.data || stories?.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 lg:py-14">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={storyData?.data?.section_title}
          subtitle={storyData?.data?.section_subtitle}
          iswhite={false}
        />
        <VideoStoriesCard stories={stories} />
        <div className="flex justify-center mt-8">
          <Button asChild className="cursor-pointer flex items-center gap-2">
            <Link href="/video-gellary" prefetch={true}>
              আরও দেখুন
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoStories;
