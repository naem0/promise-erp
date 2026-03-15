import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import { Course } from "@/apiServices/courseListPublicService";
import { PublicCourse } from "@/apiServices/studentDashboardService";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import RatingStars from "@/components/common/RatingStars";
import Link from "next/link";

const CourseCard = ({ course }: { course: Course | PublicCourse }) => {
  return (
    <Card
      key={course?.id}
      className="transition-all hover:shadow-lg py-0 gap-0 group h-full flex flex-col justify-between"
    >
      <CardHeader className="p-0 rounded-t-lg overflow-hidden">
        <AspectRatio ratio={3 / 2} className="bg-muted rounded-lg relative">
          <Image
            src={course?.featured_image || "/images/hero-banner/courselist.png"}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {course.batch?.discount ? (
            <Badge className="absolute top-3 right-3">
              {course?.batch?.discount} {course?.batch?.discount_type === "percentage" ? "%" : "৳"} off
            </Badge>
          ) : null}
        </AspectRatio>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-medium text-secondary text-base tracking-tight capitalize">
          {course?.title}
        </h3>
        <div className="flex items-center gap-1 justify-end pb-1">
          <RatingStars rating={course?.ratings ?? 0} />
        </div>

        <div className="flex justify-between items-center text-sm text-secondary">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course?.total_live_class ?? "N/A"} Classes</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.batch?.duration || "N/A"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {course?.batch?.after_discount &&
          course?.batch?.after_discount > 0 ? (
            <span className="text-sm text-muted-foreground line-through">
              ৳ {course.batch.price}
            </span>
          ) : null}

          <span className="text-lg font-bold text-primary">
            ৳ {course?.batch?.after_discount || course?.batch?.price || 0}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 justify-center">
        <Link href={`/courses/${course?.slug}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
