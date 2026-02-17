"use client";

import { useState } from "react";
import { Play, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HeroSectionResponse } from "@/apiServices/homePageService";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface HeroVideoData {
  heroBannerData: HeroSectionResponse;
}

const HomeHeroSection = ({ heroBannerData }: HeroVideoData) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const sliderData = heroBannerData?.data;
  const videoUrl =
    sliderData?.video_url || "https://youtu.be/DeRVmBh0oG8?si=_tjmWhyhs7nBQC64";

  const featureImage =
    sliderData?.background_image || "/images/home/hero-banner.webp";

  return (
    <section className="bg-secondary/5 relative">
      {/* Hero Background Image - Optimized for LCP */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/hero-slider.webp"
          alt="Hero background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center pe-0 lg:pe-4 py-14 md:py-18">
            <h1 className="text-secondary capitalize font-bold text-2xl md:text-4xl xl:text-6xl leading-normal">
              {sliderData?.title}
            </h1>
            <p className="md:text-2xl text-xl font-medium text-black/75">
              {sliderData?.subtitle}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <Button asChild className="flex items-center gap-2">
                <Link href={sliderData?.button_link_one || "#"}>
                  {sliderData?.button_text_one}
                  <MoveRight className="w-5 h-5 animate-bounce" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href={sliderData?.button_link_two || "/free-seminars"}>
                  {sliderData?.button_text_two || "Free Seminars"}
                  <MoveRight className="w-5 h-5 animate-bounce" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT VIDEO */}
          <div
            className="group py-14 md:py-18 "
            style={{
              backgroundImage: 'url("/images/home/hero-video-bg-image.webp")',
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="rounded-2xl overflow-hidden border-6 min-h-[425px] border-white relative">
              <ReactPlayer
                className="aspect-video"
                src={videoUrl}
                playing={isPlaying}
                controls={isPlaying}
                width="100%"
                height="100%"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <div
                  className="flex items-center justify-center cursor-pointer absolute inset-0"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={featureImage}
                      alt="Feature"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="flex items-center justify-center h-full">
                      <button
                        className="video-play-btn animate-pulse"
                        aria-label="Play video"
                      >
                        <Play className="w-8 h-8 md:w-10 md:h-10" />
                      </button>
                    </div>
                    <div className=" absolute inset-0  group-hover:bg-secondary/20 transition-all"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
