"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import dynamic from "next/dynamic";
import { SuccessStoryItem } from "@/apiServices/homePageService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const ReactPlayer = dynamic(() => import("react-player").then((mod) => mod.default || mod), { ssr: false });

interface VideostoriesProps {
  stories: SuccessStoryItem[];
}

const VideoStoriesCard = ({ stories }: VideostoriesProps) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVideo = stories?.find((v) => v.id === selectedVideo);

  // Observe scroll to toggle floating mini-player
  useEffect(() => {
    const element = containerRef.current;
    if (!selectedVideo || !element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If active video section scrolls out of viewport, show floating mini-player
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [selectedVideo]);

  // Global video event listener to ensure single video plays at a time
  useEffect(() => {
    const handleGlobalPlay = (e: CustomEvent) => {
      if (e.detail?.source !== `story-${selectedVideo}`) {
        setSelectedVideo(null);
        setIsFloating(false);
      }
    };

    window.addEventListener("global-video-play", handleGlobalPlay as EventListener);
    return () => {
      window.removeEventListener("global-video-play", handleGlobalPlay as EventListener);
    };
  }, [selectedVideo]);

  const handlePlayStory = (videoId: number) => {
    window.dispatchEvent(
      new CustomEvent("global-video-play", { detail: { source: `story-${videoId}` } })
    );
    setSelectedVideo(videoId);
    setIsFloating(false);
  };

  const handleCloseFloating = () => {
    setSelectedVideo(null);
    setIsFloating(false);
  };

  if (!stories || stories?.length === 0) {
    return <NotFoundComponent message="No Videos Found" />;
  }

  return (
    <>
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-5">
        {stories?.map((video) => {
          const isActive = selectedVideo === video?.id && !isFloating;

          return (
            <div
              key={video?.id}
              className="relative overflow-hidden rounded-2xl group aspect-video bg-black/5"
            >
              {isActive ? (
                <ReactPlayer
                  src={video?.youtube_link || undefined}
                  playing={true}
                  controls
                  width="100%"
                  height="100%"
                  onPlay={() => {
                    window.dispatchEvent(
                      new CustomEvent("global-video-play", {
                        detail: { source: `story-${video?.id}` },
                      })
                    );
                  }}
                  onPause={() => {
                    if (selectedVideo === video?.id && !isFloating) {
                      setSelectedVideo(null);
                    }
                  }}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={(video?.thumbnail_image && typeof video?.thumbnail_image === "string" && video?.thumbnail_image.trim() !== "") ? video?.thumbnail_image : "/images/placeholder_img.jpg"}
                    alt="Success Story Video Thumbnail"
                    fill
                    className="object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 group-hover:bg-secondary/20 transition-all rounded-2xl"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <button
                      className="video-play-btn animate-pulse cursor-pointer"
                      aria-label="Play success story video"
                      onClick={() => handlePlayStory(video?.id)}
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

      {/* Floating Picture-in-Picture Mini Player */}
      {isFloating && activeVideo && (
        <div className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 md:w-96 aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border-2 border-primary animate-in slide-in-from-bottom-5 duration-300">
          <button
            onClick={handleCloseFloating}
            className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close floating video"
          >
            <X className="w-4 h-4" />
          </button>
          <ReactPlayer
            src={activeVideo?.youtube_link || undefined}
            playing={true}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}
    </>
  );
};

export default VideoStoriesCard;
