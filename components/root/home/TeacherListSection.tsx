"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // shadcn/ui Carousel
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TeacherApiResponse } from "@/apiServices/homePageService";

interface TeacherListSectionProps {
  teacherData: TeacherApiResponse | null;
}
const TeacherListSection = ({ teacherData }: TeacherListSectionProps) => {
  const instructors = teacherData?.data?.teachers || [];
  return (
    <>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-full relative"
      >
        <CarouselContent className="py-4">
          {instructors.map((instructor) => (
            <CarouselItem
              key={instructor?.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="flex flex-col items-center group">
                {/* Image Wrapper */}

                <div className=" z-20 relative h-48 w-fit rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-102">
                  <Image
                    src={
                      instructor?.profile_image || "/images/placeholder_img.jpg"
                    }
                    alt={instructor?.name || "teacher image"}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-102"
                  />
                </div>

                {/* Card */}
                <Card className="text-center w-full rounded-2xl shadow-md transition-all duration-500 -mt-20 pt-28 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <CardContent>
                    <h3 className="text-base md:text-xl capitalize font-bold text-secondary mb-1">
                      {instructor?.name || "Teacher Name ---"}
                    </h3>

                    <p className="text-black/75 text-base font-medium mb-2">
                      {instructor?.designation ?? "Designation ---"}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-primary mb-2 animate-fade-in">
                      <Award />
                      <span className="text-base font-medium">
                        সার্টিফাইড ট্রেইনার
                      </span>
                    </div>

                    <p className="text-black/75 text-base">
                      {instructor.experience || "Experience ---"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className=" absolute cursor-pointer left-0 md:-left-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none " />
        <CarouselNext className="absolute cursor-pointer right-0 md:right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none" />
      </Carousel>
      <div className="flex justify-center mt-8">
        <Button asChild className="cursor-pointer flex items-center gap-2">
          <Link href="/trainers" prefetch={true}>
            সকল প্রশিক্ষক দেখুন
          </Link>
        </Button>
      </div>
    </>
  );
};

export default TeacherListSection;
