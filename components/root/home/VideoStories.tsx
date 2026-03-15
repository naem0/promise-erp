import {
  fetchPublicVideoGalleries,
  SuccessStoryItem,
} from "@/apiServices/homePageService";
import SectionTitle from "@/components/common/SectionTitle";
import { cacheTag } from "next/cache";
import VideoStoriesCard from "./VideoStoriesCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const VideoStories = async () => {
  "use cache";
  cacheTag("public-video-galleries");
  const storyData = await fetchPublicVideoGalleries();
  const stories: SuccessStoryItem[] = storyData?.data?.video_galleries || [];

  if (!stories.length) {
    return (
      <NotFoundComponent
        message={storyData?.message || "No video galleries found"}
      />
    );
  }

  return (
    <section className="bg-white py-8 md:py-14">
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
