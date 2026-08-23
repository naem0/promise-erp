import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentSuccessSkeleton() {
  return (
    <section
      className="py-8 md:py-14 bg-cover bg-no-repeat bg-center min-h-[600px] relative"
    >
      <div className="container mx-auto px-4">
        {/* Title Section Skeleton */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-3xs bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>

        {/* Carousel Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-5">
          {[1, 2].map((i) => (
            <StudentSkeletonCard key={i} />
          ))}
        </div>

        {/* Bottom Button Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-32 bg-secondary/15 rounded-md" />
        </div>
      </div>
    </section>
  );
}

function StudentSkeletonCard() {
  return (
    <div className="flex flex-col items-center group">
      {/* Circular Image Wrapper */}
      <div className="z-20 relative">
        <div className="rounded-full overflow-hidden shadow-xl">
          <Skeleton className="h-[150px] w-[150px] rounded-full bg-secondary/15" />
        </div>
      </div>

      {/* Card */}
      <Card className="text-center w-full rounded-2xl shadow-md -mt-20 pt-28">
        <CardContent className="space-y-3">
          {/* Name */}
          <Skeleton className="h-6 w-32 mx-auto bg-secondary/15" />

          {/* Course Title */}
          <Skeleton className="h-4 w-40 mx-auto bg-secondary/15" />

          {/* Rating Stars */}
          <div className="flex justify-center pb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-4 rounded-full bg-secondary/15"
                />
              ))}
            </div>
          </div>

          {/* Feedback */}
          <Skeleton className="h-4 w-full bg-secondary/15" />
          <Skeleton className="h-4 w-3/4 mx-auto bg-secondary/15" />
        </CardContent>
      </Card>
    </div>
  );
}

