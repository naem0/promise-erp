import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/apiServices/homePageService";
import Image from "next/image";
import RatingStars from "@/components/common/RatingStars";

interface StoriesCardItemsProps {
  item: Review;
}
const StoriesCardItems = ({ item }: StoriesCardItemsProps) => {
  const { name, course_title, feedback, rating, profile_image } = item;
  return (
    <Card className="py-0">
      <CardContent className="p-4 flex gap-4 items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between lg:flex-row flex-col">
            <div>
              <h3 className="font-semibold text-xl text-secondary leading-tight mb-1">
                {name || "Name"}
              </h3>
              <p className="text-sm sm:text-base text-black">
                {course_title || "Course Title"}
              </p>
            </div>
            <div className="flex gap-0.5 ml-2 shrink-0">
              <RatingStars rating={rating} starSize={4} />
            </div>
          </div>
          <p className="text-sm text-black mt-2 leading-relaxed">{feedback}</p>
        </div>
        <div className="shrink-0">
          <div className="relative rounded-lg overflow-hidden w-30 h-30">
            <Image
              src={profile_image || "/images/placeholder-avatar.png"}
              alt={name || " profile picture"}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoriesCardItems;
