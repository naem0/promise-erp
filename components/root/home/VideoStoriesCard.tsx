"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import dynamic from "next/dynamic";
import { SuccessStoryItem } from "@/apiServices/homePageService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideostoriesProps {
  stories: SuccessStoryItem[];
}

const VideoStoriesCard = ({ stories }: VideostoriesProps) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  if (!stories || stories.length === 0) {
    return <NotFoundComponent message="No Videos Found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stories.map((video) => {
        const isActive = selectedVideo === video.id;

        return (
          <div
            key={video.id}
            className="relative overflow-hidden rounded-2xl group aspect-video"
          >
            {isActive ? (
              <ReactPlayer
                src={video.youtube_link}
                playing={isActive}
                controls
                width="100%"
                height="100%"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={video.thumbnail_image || "/images/placeholder_img.jpg"}
                  alt="Success Story Video Thumbnail"
                  fill
                  className="object-cover"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 group-hover:bg-secondary/20 transition-all rounded-2xl"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <button
                    className="video-play-btn animate-pulse"
                    aria-label="Play success story video"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <Play className="w-8 h-8 md:w-10 md:h-10" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VideoStoriesCard;
