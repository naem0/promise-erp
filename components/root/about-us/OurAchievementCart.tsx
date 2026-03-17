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
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { PublicAchievement } from "@/apiServices/aboutPageService";


interface OurAchievementCartProps {
  achievements: PublicAchievement[];
}

const OurAchievementCart = ({ achievements }: OurAchievementCartProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const showControls = achievements.length > 1;

  return (
    <section className="pt-8 md:pt-14">
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-4xl font-bold text-secondary">
         Where Skills Become Success
        </h2>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {achievements.map((item) => (
            <CarouselItem key={item.id}>
              <Card className="py-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 lg:gap-8">
                    {/* Image */}
                    <div className="">
                      <div className="w-full h-[300px] md:h-[400px] relative">
                        <Image
                          src={item.image || "/images/placeholder_img.jpg"}
                          alt={item.title || "image"}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center px-4 py-4 md:py-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
                        {item.title || "Dummy Title"}
                      </h3>

                      <p className="text-black mb-4 whitespace-pre-line leading-relaxed">
                        {item.description || "Dummy Description"}
                      </p>
                      <div className="border-t pt-4">
                        <p className="font-bold text-primary text-lg">
                          {item.name || "Dummy Name"}
                        </p>
                        <p className="text-gray-500">{item.designation || "Dummy Designation"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Conditional Arrows */}
        {showControls && (
          <>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-white w-10 h-10 rounded-full shadow-lg border-0" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-white w-10 h-10 rounded-full shadow-lg border-0" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default OurAchievementCart
