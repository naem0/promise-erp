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

const CourseCard = ({
  course,
  branchId,
}: {
  course: Course | PublicCourse;
  branchId?: string;
}) => {
  const branch = branchId ?? "49";
  const courseLink = course?.slug
    ? `/courses/${course.slug}?branch_id=${branch}`
    : "#";

  return (
    <Link href={courseLink}>
      <Card
        key={course?.id}
        className="transition-all hover:shadow-lg py-0 gap-0 group h-full flex flex-col justify-between"
      >
        <CardHeader className="p-0 rounded-t-lg overflow-hidden">
          <AspectRatio
            ratio={3 / 2}
            className="bg-muted rounded-t-lg relative overflow-hidden"
          >
            <Image
              src={(course?.featured_image && typeof course?.featured_image === "string" && course?.featured_image.trim() !== "") ? course?.featured_image : "/images/hero-banner/courselist.png"}
              alt={course.title}
              height={400}
              width={600}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {course.batch?.discount ? (
              <Badge className="absolute top-3 right-3">
                {course?.batch?.discount}{" "}
                {course?.batch?.discount_type === "percentage" ? "%" : "৳"} off
              </Badge>
            ) : null}
          </AspectRatio>
        </CardHeader>

        <CardContent className="px-4 py-2 space-y-2">
          <h3 className="font-semibold text-secondary text-sm xl:text-base tracking-tight capitalize">
            {course?.title}
          </h3>
          <div className="flex items-center gap-1 pb-1">
            <RatingStars rating={course?.ratings ?? 0} />
          </div>

          <div className="flex justify-between items-center text-sm text-secondary">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course?.total_live_class ?? " N/A"} Classes</span>
            </div>

            {course?.batch?.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course?.batch?.duration || "N/A"} Hours</span>
              </div>
            )}
            {course?.total_enrolled ? (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course?.total_enrolled || "0"} Students</span>
              </div>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 grid xl:grid-cols-1 2xl:grid-cols-2 gap-2">
          {/* <Button className="cursor-pointer">View Details</Button> */}
          <div className="flex items-center gap-2">
            {course?.batch?.after_discount &&
            course?.batch?.after_discount > 0 ? (
              <span className="text-[12px] text-muted-foreground line-through">
                ৳ {course.batch.price}
              </span>
            ) : null}

            <span className="text-sm font-medium text-primary">
              ৳{" "}
              {course?.batch?.after_discount || course?.batch?.price || "Free"}
            </span>
          </div>
          <Button className="cursor-pointer" asChild>
            <span> Course Details </span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
