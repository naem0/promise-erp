import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComplainSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Cards Skeletons */}
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-2/3" />
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg mt-2" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
