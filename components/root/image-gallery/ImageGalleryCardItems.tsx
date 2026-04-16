
"use client";

import { ImageGallery } from "@/apiServices/imageGalleryService";
import Image from "next/image";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface ImageGalleryCardItemsProps {
  event: ImageGallery;
}

const ImageGalleryCardItems = ({ event }: ImageGalleryCardItemsProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const images = event?.images || [];

  // Card-এর মতো 2x2 grid-এ প্রথম ৪টি image দেখাবে
  const gridImages = images.slice(0, 4);
  while (gridImages.length < 4) {
    gridImages.push(images[0] || "/images/placeholder_img.jpg");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full py-0 cursor-pointer hover:shadow-lg transition overflow-hidden gap-1">
          {/* 2x2 Image Grid — card-এর মতো */}
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-2 p-2 ">
              {gridImages.map((img, i) => (
                <div key={i} className="relative w-full h-[130px] lg:h-[160px]">
                  <Image
                    src={img}
                    alt={`${event?.title} ${i + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col flex-1 gap-3 p-3 text-center">
            <p className="text-base font-medium text-secondary leading-relaxed">
              {event?.title}
            </p>
            <Button className="w-full mt-auto">View More</Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-[95%] md:max-w-[85%] max-h-[90vh] p-0 overflow-y-auto outline-none transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <VisuallyHidden>
          <DialogTitle>{event?.title}</DialogTitle>
        </VisuallyHidden>

        {/* Full carousel — সব images */}
        {images.length > 0 && (
          <div className="flex flex-col items-center justify-center p-3 md:p-6 lg:p-10">
            <Carousel
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-full mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl md:text-2xl font-bold text-secondary">
                  {event?.title}
                </p>
              </div>

              <div className="relative group">
                <CarouselContent className=" w-full">
                  {images.map((img, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-xl bg-black/5">
                        <Image
                          src={img}
                          alt={`gallery-${index}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons - Centered vertically and responsive */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-mx-12 pointer-events-none">
                  <CarouselPrevious className="relative left-0 md:left-2 h-10 w-10 md:h-12 md:w-12 pointer-events-auto bg-primary text-white border border-primary cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-all duration-300" />
                  <CarouselNext className="relative right-0 md:right-2 h-10 w-10 md:h-12 md:w-12 pointer-events-auto bg-primary text-white border border-primary cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-all duration-300" />
                </div>
              </div>

              {/* Added space at the bottom */}
              <div className="h-8 md:h-12" />
            </Carousel>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryCardItems;
