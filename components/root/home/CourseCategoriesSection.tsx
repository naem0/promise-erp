"use client";

import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { CategoriesResponse } from "@/apiServices/categoryService";

interface CategoriesData {
  categoriesData: CategoriesResponse;
}

const CourseCategoriesSection = ({ categoriesData }: CategoriesData) => {
  const categories = categoriesData?.data?.categories || [];
  // autoplay plugin
  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-full relative"
    >
      <CarouselContent className="py-4">
        {categories.map((course) => (
          <CarouselItem
            key={course.id}
            className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <Card className="group h-full bg-secondary-light transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 text-center">
              <CardContent className="flex flex-col items-center justify-between gap-0 lg:gap-6 px-8">
                <div className="bg-white mt-4 rounded-full w-25 h-25 flex items-center justify-center p-3">
                  <Image
                    src={course.image || "/images/placeholder_img.jpg"}
                    alt={course.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover h-20 w-20"
                  />
                </div>

                <h3 className="text-base lg:text-2xl font-semibold capitalize text-white min-h-[4rem] flex items-center justify-center">
                  {course.name}
                </h3>

                <div className="flex justify-center ">
                  <Button
                    variant="outline"
                    asChild
                    className="py-5 flex items-center gap-2 bg-transparent hover:bg-transparent"
                  >
                    <Link href={`/courses?category_id=${course.id}`}>
                      <span className="font-semibold text-white">
                        {course.total_course} Courses
                      </span>
                      <div className="bg-primary text-white p-2 rounded-full inline-flex items-center justify-center">
                        <ChevronRight width={20} height={20} />
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows inside container */}
      <CarouselPrevious className=" absolute cursor-pointer left-0 md:-left-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none " />
      <CarouselNext className="absolute cursor-pointer right-0 md:-right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none" />
    </Carousel>
  );
};

export default CourseCategoriesSection;
