import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import RatingStars from "@/components/common/RatingStars";
import Link from "next/link";
import { StudentMyCourse } from "@/apiServices/studentDashboardService";
import MyCoursePayNowModal from "./MyCoursePayNowModal";

interface MyCourseCardProps {
  course: StudentMyCourse;
  isUpdatedCourse: boolean;
  setIsUpdatedCourse: React.Dispatch<React.SetStateAction<boolean>>;
}
const MyCourseCard = ({ course, isUpdatedCourse, setIsUpdatedCourse }: MyCourseCardProps) => {

  return (
    <Card className="transition-all hover:shadow-lg py-0 gap-0 group h-full flex flex-col justify-between">
      {/* IMAGE */}
      <CardHeader className="p-0 overflow-hidden rounded-t-xl">
        <AspectRatio ratio={3 / 2} className="relative bg-muted">
          <Image
            src={
              course?.course?.featured_image || "/images/placeholder_img.jpg"
            }
            alt={course?.course?.title}
            fill
            className="object-cover"
          />
        </AspectRatio>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between gap-3">
          <Badge className="">Batch {course?.batch?.name}</Badge>
          <RatingStars rating={course?.course?.ratings} />
        </div>
        <h3 className="text-base font-semibold text-secondary leading-snug">
          <Link
            href={`/student/mycourses/${course?.course?.slug}?batch_id=${course?.batch?.id}`}
          >
            {course?.course?.title}
          </Link>
        </h3>
        {/* Progress info */}
        <div className="flex justify-between text-sm text-primary">
          <span>Class Progress</span>
          <span>{course?.progress_text || 0}</span>
        </div>

        {/* Progress bar */}
        <Progress value={course.progress_percentage} className="h-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center gap-3">
        {course?.status === "Active" ? (
          <Link
            href={`/student/mycourses/${course?.course?.slug}?batch_id=${course?.batch?.id}`}
          >
            <Button>Continue</Button>
          </Link>
        ) : course?.status === "Expired" ? (
          <Button
            variant="outline"
            className="cursor-not-allowed bg-red-500/10 border-red-500 text-red-500 font-bold "
          >
            Your Access is Terminated
          </Button>
        ) : (
          <Button
            variant="outline"
            className="cursor-not-allowed bg-primary/10 text-primary font-bold "
          >
            {" "}
            Wait for Admin to Approve
          </Button>
        )}
        {course?.course?.due_amount > 0 && (
          <MyCoursePayNowModal course={course} isUpdatedCourse={isUpdatedCourse} setIsUpdatedCourse={setIsUpdatedCourse} />
        )}
      </CardFooter>
    </Card>
  );
};

export default MyCourseCard;
