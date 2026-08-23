"use client";

import { useState, useRef, useEffect } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HeroSectionResponse } from "@/apiServices/homePageService";

const ReactPlayer = dynamic(() => import("react-player").then((mod) => mod.default || mod), { ssr: false });

interface HeroVideoData {
  heroBannerData: HeroSectionResponse;
}

const HomeHeroSection = ({ heroBannerData }: HeroVideoData) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const sliderData = heroBannerData?.data;
  const videoUrl =
    sliderData?.video_url || "https://youtu.be/DeRVmBh0oG8?si=_tjmWhyhs7nBQC64";

  const featureImage =
    sliderData?.background_image || "/images/home/hero-banner.webp";

  // Observe scroll to toggle floating mini player
  useEffect(() => {
    const element = videoContainerRef.current;
    if (!isPlaying || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

  // Global video event listener to ensure single video plays at a time
  useEffect(() => {
    const handleGlobalPlay = (e: CustomEvent) => {
      if (e.detail?.source !== "hero") {
        setIsPlaying(false);
        setIsFloating(false);
      }
    };

    window.addEventListener("global-video-play", handleGlobalPlay as EventListener);
    return () => {
      window.removeEventListener("global-video-play", handleGlobalPlay as EventListener);
    };
  }, []);

  const handlePlayHero = () => {
    window.dispatchEvent(
      new CustomEvent("global-video-play", { detail: { source: "hero" } })
    );
    setIsPlaying(true);
    setIsFloating(false);
  };

  const handleCloseFloating = () => {
    setIsPlaying(false);
    setIsFloating(false);
  };

  return (
    <section className="bg-secondary/5 relative min-h-[420px] md:min-h-[500px]">
      {/* Hero Background Image - Optimized for LCP */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/hero-slider.webp"
          alt="Hero background"
          fill
          priority
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center pe-0 lg:pe-4 py-8 xl:py-18">
            <h1 className="text-secondary capitalize font-bold text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl leading-tight mb-2">
              {sliderData?.title}
            </h1>
            <p className="xl:text-xl text-lg text-black/75">
              {sliderData?.subtitle}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <Button asChild className="flex items-center gap-2">
                <Link href={sliderData?.button_link_one || "/courses"} prefetch={true}>
                  {sliderData?.button_text_one}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href={sliderData?.button_link_two || "/free-seminars"} prefetch={true}>
                  {sliderData?.button_text_two || "Free Seminars"}
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT VIDEO */}
          <div
            ref={videoContainerRef}
            className="group py-10 pt-0 md:py-18 "
            style={{
              backgroundImage: 'url("/images/home/hero-video-bg-image.webp")',
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="rounded-2xl overflow-hidden border-6 min-h-[250px] sm:min-h-[325px] lg:min-h-[425px] border-white relative bg-black/5">
              {isPlaying && !isFloating ? (
                <ReactPlayer
                  className="absolute inset-0"
                  src={videoUrl || undefined}
                  playing={true}
                  controls={true}
                  width="100%"
                  height="100%"
                  onPlay={() => {
                    window.dispatchEvent(
                      new CustomEvent("global-video-play", { detail: { source: "hero" } })
                    );
                  }}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div
                  className="flex items-center justify-center absolute inset-0"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={featureImage}
                      alt="Feature"
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="sm:object-cover object-fill"
                    />
                    <div className="flex items-center justify-center h-full">
                      <button
                        className="video-play-btn animate-pulse cursor-pointer"
                        aria-label="Play video"
                        onClick={handlePlayHero}
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

      {/* Floating Picture-in-Picture Mini Player for Hero Video */}
      {isFloating && isPlaying && (
        <div className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 md:w-96 aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border-2 border-primary animate-in slide-in-from-bottom-5 duration-300">
          <button
            onClick={handleCloseFloating}
            className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close floating video"
          >
            <X className="w-4 h-4" />
          </button>
          <ReactPlayer
            src={videoUrl || undefined}
            playing={true}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}
    </section>
  );
};

export default HomeHeroSection;
