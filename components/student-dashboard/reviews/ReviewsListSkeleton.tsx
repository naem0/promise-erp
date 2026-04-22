import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm bg-white rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Skeleton className="h-12 w-12 rounded-full shrink-0 mt-1" />
          <div className="flex flex-col gap-2 flex-1">
            {/* Name */}
            <Skeleton className="h-5 w-36" />
            {/* Comment lines */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[18px] w-[18px] rounded-sm" />
              ))}
            </div>
            {/* Course name */}
            <Skeleton className="h-4 w-48" />
            {/* Batch & date */}
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
