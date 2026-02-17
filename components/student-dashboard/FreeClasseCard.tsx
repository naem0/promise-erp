import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { FreeSeminar } from "@/apiServices/studentDashboardService";
interface FreeClasseCardProps {
  course: FreeSeminar;
}
const FreeClasseCard = ({ course }:FreeClasseCardProps ) => {
  return (
    <Card className="transition-all hover:shadow-lg py-0 gap-0 group h-full flex flex-col justify-between">
      {/* IMAGE */}
      <CardHeader className="p-0 overflow-hidden rounded-t-xl">
        <AspectRatio ratio={3 / 2} className="relative bg-muted">
          <Image
            src={course?.image || "/images/placeholder_img.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </AspectRatio>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between gap-3">
          <Badge className="">Batch {course.seminar_type === 0 ? "Offline" : "Online"}</Badge>
        </div>
        <h3 className="text-base font-semibold text-secondary leading-snug">
          <Link href={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        <div className="flex justify-between items-center text-sm text-secondary">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{course?.seminar_date ?? "N/A"}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.seminar_time_formatted|| "N/A"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-center">
        <Link href={`/free-seminars/${course.slug}`}>
          <Button>Join Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default FreeClasseCard
