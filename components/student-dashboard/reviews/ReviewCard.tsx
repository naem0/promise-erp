
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StudentReview } from "@/apiServices/studentDashboardService";
import RatingStars from "@/components/common/RatingStars";
import Image from "next/image";

interface ReviewCardProps {
  review: StudentReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md bg-white rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-[100px] h-[100px] rounded-full border border-primary shadow-lg ">
              <Image
                src={(review?.user?.profile_image && typeof review?.user?.profile_image === "string" && review?.user?.profile_image.trim() !== "") ? review?.user?.profile_image : "/images/placeholder-avatar.jpg"}
                alt={review?.user?.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-primary text-lg mb-1">{review?.user?.name}</h4>
              <p className="text-[13px] text-black leading-normal line-clamp-2 mb-3">
                {review?.feedback}
              </p>

              <div className="flex gap-1 mb-3">
                <RatingStars rating={review?.rating} />
              </div>

              <h5 className="font-bold text-secondary text-base mb-1">{review?.course?.name}</h5>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-primary">{review?.batch?.name}</span>
                <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                  📅 {review?.created_at}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
