import SectionTitle from "@/components/common/SectionTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RatingStars from "@/components/common/RatingStars";
import { ReviewApiResponse } from "@/apiServices/homePageService";

interface StudentSuccessStoriesProps {
  reviewsData: ReviewApiResponse | null;
}
const StudentSuccessStories = ({ reviewsData }: StudentSuccessStoriesProps) => {
  const reviews = reviewsData?.data?.reviews || [];
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
          {reviews.map((instructor) => (
            <CarouselItem
              key={instructor.id}
              className="basis-full md:basis-1/2"
            >
              <div className="flex flex-col items-center group">
                {/* Image Wrapper */}
                <div className="z-20 relative">
                  <div className="rounded-full w-[150px] h-[150px] overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-102">
                    <Image
                      src={instructor.profile_image || "/images/placeholder_img.jpg"}
                      alt={instructor.name}
                      fill
                      className=" object-cover rounded-full transition-transform duration-700 group-hover:scale-102"
                    />
                  </div>
                </div>

                {/* Card */}
                <Card className="text-center w-full rounded-2xl shadow transition-all duration-500 -mt-20 pt-28 group-hover:-translate-y-2 group-hover:shadow-md">
                  <CardContent>
                    <h3 className="text-base md:text-xl capitalize font-bold text-secondary mb-1">
                      {instructor?.name}
                    </h3>

                    <p className="text-black/75 text-base font-medium mb-2">
                      {instructor?.course_title}
                    </p>
                    <div className="flex justify-center pb-4">
                      <RatingStars rating={instructor?.rating} />
                    </div>

                    <p className="text-black/75 text-lg">
                      {instructor?.feedback}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="cursor-pointer absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none shadow-md" />
        <CarouselNext className="cursor-pointer absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white hover:text-white rounded-full border-none shadow-md" />
      </Carousel>

      <div className="flex justify-center mt-8">
        <Button asChild className="cursor-pointer flex items-center gap-2">
          <Link href="/success-stories" prefetch={true}>
            আরও পড়ুন
            <MoveRight className="w-5 h-5 animate-bounce" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default StudentSuccessStories;
