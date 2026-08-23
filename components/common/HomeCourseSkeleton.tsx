import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeCourseSkeleton() {
  return (
    <div className="w-full py-8 lg:py-14 bg-secondary/5">
      {/* Title Section Skeleton */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-3xs bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>

        {/* Responsive Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Bottom Button Skeleton */}
        <div className="flex justify-center mt-10">
          <Skeleton className="h-10 min-w-3xs bg-secondary/15 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   SINGLE SKELETON CARD (Course Card Structure)
   =========================================================== */
function SkeletonCard() {
  return (
    <Card className="rounded-xl py-0 overflow-hidden shadow-sm border">
      {/* Image Area */}
      <div className="relative w-full h-[200px] bg-secondary/15">
        <Skeleton className="w-full h-full" />

        {/* Discount Badge */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full bg-secondary/30" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-full bg-secondary/15" />

        {/* Rating Row */}
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="h-4 w-24 bg-secondary/15" />
        </div>

        {/* Classes + Duration */}
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-4 w-24 bg-secondary/15" />
          <Skeleton className="h-4 w-20 bg-secondary/15" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 bg-secondary/15" />
          <Skeleton className="h-4 w-28 bg-secondary/15" />
        </div>

        {/* Button */}
        <div className="pt-3">
          <Skeleton className="h-10 w-full rounded-md bg-secondary/15" />
        </div>
      </div>
    </Card>
  );
}
