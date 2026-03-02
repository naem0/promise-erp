import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TrainerSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center bg-secondary/10">
          {/* Image Skeleton */}
          <div className="relative h-48 w-40 rounded-2xl shadow-xl z-20">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>

          {/* Card Skeleton */}
          <Card className="text-center h-full pb-0 w-full rounded-2xl shadow-md -mt-20 pt-28">
            <CardContent className="space-y-3">
              {/* Name */}
              <Skeleton className="h-6 w-3/4 mx-auto" />

              {/* Designation */}
              <Skeleton className="h-4 w-1/2 mx-auto" />

              {/* Certified */}
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Experience */}
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </CardContent>

            {/* Bottom Bar */}
            <div className="h-2 w-full">
              <Skeleton className="h-full w-full rounded-b-lg" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TrainerSkeletonGrid;
