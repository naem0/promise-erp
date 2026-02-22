import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const MyCourseSkeleton = () => {
  return (
    <div className="container mx-auto">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="h-full flex flex-col justify-between gap-0 py-0 bg-secondary/5 "
          >
            {/* IMAGE */}
            <CardHeader className="p-0 overflow-hidden rounded-t-xl">
              <AspectRatio ratio={3 / 2} className="relative">
                <Skeleton className="bg-white absolute inset-0 w-full h-full" />
              </AspectRatio>
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="p-4 space-y-3 flex-1">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="bg-white h-6 w-20 rounded-full" />{" "}
                {/* Batch */}
                <Skeleton className="bg-white h-6 w-16 rounded" />{" "}
                {/* Rating */}
              </div>
              <Skeleton className="bg-white h-5 w-3/4 rounded" />{" "}
              {/* Course Title */}
              <div className="flex justify-between text-sm">
                <Skeleton className="bg-white h-3 w-20 rounded" />{" "}
                {/* Class Progress */}
                <Skeleton className="bg-white h-3 w-10 rounded" />{" "}
                {/* Progress Number */}
              </div>
              <Skeleton className="bg-white h-2 w-full rounded" />{" "}
              {/* Progress Bar */}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-center">
              <Skeleton className="bg-white h-10 w-full rounded" />{" "}
              {/* Button */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyCourseSkeleton;
