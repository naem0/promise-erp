"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface LessonVideoPlayerProps {
  videoUrl: string;
}

const MyCourseLessonVideoPlayer = ({ videoUrl }: LessonVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-white min-h-[425px] relative bg-black">
      <ReactPlayer
        className="aspect-video"
        src={videoUrl}
        playing={isPlaying}
        controls={true}
        width="100%"
        height="100%"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40"
        >
          <button
            onClick={() => setIsPlaying(true)}
            className="w-18 h-18 cursor-pointer rounded-full bg-primary flex items-center justify-center"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourseLessonVideoPlayer;
