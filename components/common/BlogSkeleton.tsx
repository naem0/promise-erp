import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BlogSkeleton = () => {
  return (
    <div className="w-full py-8 lg:py-14 bg-secondary/5">
      {/* Title Section Skeleton */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-52 bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
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
  )
}

export default BlogSkeleton

function SkeletonCard() {
  return (
    <Card className="rounded-xl py-0 overflow-hidden shadow-sm border">
      {/* Image Area */}
      <div className="relative w-full h-[200px] bg-secondary/15">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-10 bg-secondary/15" />

        {/* Rating Row */}
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="h-4 w-full bg-secondary/15" />
        </div>

        {/* Button */}
        <div className="pt-3">
          <Skeleton className="h-10 w-full rounded-md bg-secondary/15" />
        </div>
      </div>
    </Card>
  );
}
