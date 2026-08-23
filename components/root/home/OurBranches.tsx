"use client";

import { useRef, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { BranchApiResponse } from "@/apiServices/homePageService";

interface BranchesDataProps {
  branchesData: BranchApiResponse | null;
}

const OurBranches = ({ branchesData }: BranchesDataProps) => {
  const branches = branchesData?.data?.branches || [];

  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const handleMouseEnter = useCallback(() => {
    plugin.current.stop();
  }, []);

  const handleMouseLeave = useCallback(() => {
    plugin.current.play();
  }, []);

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-full relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselContent className="py-4 items-stretch">
        {branches?.map((branche) => (
          <CarouselItem
            key={branche?.id}
            className="basis-full sm:basis-1/2 lg:basis-1/2 xl:basis-1/4 flex"
          >
            <Card className="group flex flex-col w-full bg-white hover:bg-primary shadow-lg py-0 border border-secondary/30 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col flex-1 items-center gap-2 p-4 text-center">
                {/* Icon */}
                <div className="bg-white mx-auto rounded-full shadow-md w-[60px] h-[60px] flex items-center justify-center p-2">
                  <Image
                    src="/images/home/branch-icon.png"
                    alt={branche?.name}
                    width={40}
                    height={40}
                    className="object-scale-down"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-secondary group-hover:text-white">
                  {branche?.name}
                </h3>

                {/* Address */}
                <p className="text-secondary/80 group-hover:text-white text-sm flex items-start gap-2 text-left">
                  <MapPin className="w-10 h-10 mt-1 shrink-0" />
                  {branche?.address ||
                    "Khaja IT Park, 2nd to 7th Floor, Kallyanpur Bus Stop, Mirpur Road, Dhaka-1207."}
                </p>

                {/* Phone */}
                <div className="text-secondary/80 group-hover:text-white text-sm flex items-start gap-2 text-left w-full justify-center">
                  <Phone className="w-4 h-4 mt-1 shrink-0" />
                  <div className="flex flex-col">
                    {Array.isArray(branche?.phone) && branche?.phone?.length > 0
                      ? branche?.phone?.map((phone: string, index: number) => (
                          <span key={index}>{phone}</span>
                        ))
                      : "01332-852500"}
                  </div>
                </div>

                {/* Email */}
                <ul className="text-secondary/80 group-hover:text-white text-sm flex flex-col gap-1">
                  <li className="flex flex-col items-center gap-1">
                    {Array.isArray(branche?.email) && branche?.email?.length > 0 ? (
                      branche?.email?.map((email: string, index: number) => (
                        <span key={index}>{email}</span>
                      ))
                    ) : (
                      <span>info@e-laeltd.com</span>
                    )}
                  </li>
                </ul>

                {/* Map - pushed to bottom */}
                <div className="mt-auto w-full">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=${branche?.google_map}`}
                    width="100%"
                    height="100"
                    title={`${branche?.name || "Branch"} Location Map`}
                    className="rounded-xl border border-secondary p-0"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious className="absolute cursor-pointer left-0 md:-left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-primary/80 text-primary group-hover:text-white rounded-full border-primary shadow-md" />
      <CarouselNext className="absolute cursor-pointer right-0 md:-right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-primary/80 text-primary group-hover:text-white rounded-full border-primary shadow-md" />
    </Carousel>
  );
};

export default OurBranches;
