"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { PaginationType } from "@/types/pagination";
import Pagination from "@/components/common/Pagination";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoItem {
  id: number;
  youtube_link: string;
  thumbnail_image: string;
}

interface VideostoriesProps {
  stories: VideoItem[];
  totalPages: PaginationType | undefined;
}

const VideoGalleryInfo = ({ stories, totalPages }: VideostoriesProps) => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const firstVideo = stories[0];
  const otherVideos = stories.slice(1);

  return (
    <div className="container mx-auto px-4 py-8 md:py-14">
      {/* ================= FIRST SECTION ================= */}
      <section>
        <div className="relative overflow-hidden rounded-2xl group">
          {activeVideo === firstVideo.id ? (
            <ReactPlayer
              src={firstVideo.youtube_link}
              playing
              controls
              width="100%"
              height="100%"
              className="aspect-video"
            />
          ) : (
            <div
              className="relative aspect-video cursor-pointer"
              onClick={() => setActiveVideo(firstVideo.id)}
            >
              <Image
                src={firstVideo.thumbnail_image}
                alt="Video Thumbnail"
                fill
                className="object-cover rounded-2xl"
              />

              <div className="absolute inset-0 flex items-center justify-center text-white">
                <button
                  className="video-play-btn animate-pulse"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= GRID SECTION ================= */}
      <section className="pt-8 md:pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {otherVideos.map((video) => (
            <div
              key={video.id}
              className="relative overflow-hidden rounded-2xl group"
            >
              {activeVideo === video.id ? (
                <ReactPlayer
                  src={video.youtube_link}
                  playing
                  controls
                  width="100%"
                  height="100%"
                  className="aspect-video"
                />
              ) : (
                <div
                  className="relative aspect-video cursor-pointer"
                  onClick={() => setActiveVideo(video.id)}
                >
                  <Image
                    src={video.thumbnail_image}
                    alt="Video Thumbnail"
                    fill
                    className="object-cover rounded-2xl"
                  />

                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <button
                      className="video-play-btn animate-pulse"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {totalPages && (
        <div className="pt-6">
          <Pagination pagination={totalPages} />
        </div>
      )}
    </div>
  );
};

export default VideoGalleryInfo;
