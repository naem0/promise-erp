import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TrainerSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center h-full">
          {/* Image Skeleton */}
          <div className="z-10 relative h-40 w-[65%] rounded-2xl shadow-xl">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>

          {/* Card Skeleton */}
          <Card className="text-center relative flex-1 pb-0 w-full rounded-2xl shadow-md -mt-20 pt-24 flex flex-col overflow-hidden">
            <CardContent className="relative flex-1 p-6 space-y-4">
              {/* Name */}
              <Skeleton className="h-7 w-3/4 mx-auto" />

              {/* Designation */}
              <Skeleton className="h-5 w-1/2 mx-auto" />

              {/* Certified */}
              <div className="flex items-center justify-center gap-2 bg-primary/5 py-2 rounded-full">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Experience */}
              <Skeleton className="h-5 w-2/3 mx-auto" />
            </CardContent>

            {/* Bottom Bar */}
            <div className="h-1.5 w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TrainerSkeletonGrid;
