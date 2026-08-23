import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherListSkeleton() {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Title Section Skeleton */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-3xs bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>

        {/* Carousel Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <TeacherSkeletonCard key={i} />
          ))}
        </div>

        {/* Bottom Button Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-48 bg-secondary/15 rounded-md" />
        </div>
      </div>
    </section>
  );
}

function TeacherSkeletonCard() {
  return (
    <div className="flex flex-col items-center group">
      {/* Image Wrapper */}
      <div className="z-20 relative">
        <div className="h-48 w-fit rounded-2xl overflow-hidden shadow-xl">
          <Skeleton className="h-48 w-48 rounded-2xl bg-secondary/15" />
        </div>
      </div>

      {/* Card */}
      <Card className="text-center w-full rounded-2xl shadow-md -mt-20 pt-28">
        <CardContent className="space-y-3">
          {/* Name */}
          <Skeleton className="h-6 w-32 mx-auto bg-secondary/15" />

          {/* Designation */}
          <Skeleton className="h-4 w-40 mx-auto bg-secondary/15" />

          {/* Award Badge */}
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-secondary/15" />
            <Skeleton className="h-4 w-28 bg-secondary/15" />
          </div>

          {/* Experience */}
          <Skeleton className="h-4 w-24 mx-auto bg-secondary/15" />
        </CardContent>
      </Card>
    </div>
  );
}

