"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const images = [
  "/images/slider-new-img.png",
  "/images/chievmentSlider2.png",
  "/images/achievmentSlider1.png",
  "/images/chievmentSlider2.png",
];

const OurAchievements = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  return (
    <section className="py-10 md:py-12">
      {/* Title */}
      <div className="text-center pb-8">
        <h2 className="text-3xl font-semibold">Our Achievements</h2>
      </div>

      {/* Main Slider */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="flex justify-center relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg">
                <Image
                  src={src}
                  alt="achievements image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Thumbnail Slider */}
      <div className="mt-6">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
        >
          <CarouselContent className="gap-4">
            {images.map((src, index) => (
              <CarouselItem
                key={index}
                className="basis-1/4 cursor-pointer"
                onClick={() => handleThumbClick(index)}
              >
                <div className="w-full h-[200px] relative">
                  <Image
                    src={src}
                    alt="thumbnail"
                    fill
                    className={`rounded-md border object-cover ${
                      activeIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default OurAchievements;
