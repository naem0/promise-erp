import { Card, CardContent } from "@/components/ui/card";
import { Quote, } from "lucide-react";
import Image from "next/image";
import RatingStars from "@/components/common/RatingStars";
import { Review } from "@/apiServices/courseDetailPublicService";

const AVATAR_PLACEHOLDER = "https://placehold.co/40x40/4f46e5/ffffff/png?text=U";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Card key={review.id} className="animate-in fade-in hover:scale-105 transition-transform duration-500 h-full">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">{review.feedback}</p>
                <div className="flex justify-between items-start pt-4 border-t">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={review.user.profile_image || AVATAR_PLACEHOLDER}
                      alt={review.user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <RatingStars rating={review.rating} />
                    </div>
                  </div>
                  <div>
                    <Quote className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default ReviewCard
