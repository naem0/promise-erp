import { Skeleton } from "@/components/ui/skeleton";

const PartnerSkeleton = () => {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">

        {/* Title Section */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-10 w-64 bg-secondary/15" />
          <Skeleton className="h-5 w-40 bg-secondary/15" />
        </div>

        {/* Subtitle or Extra Line */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96 bg-secondary/15" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {/* 5–8 Items Placeholder */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Image Skeleton */}
              <Skeleton className="w-full h-24 bg-secondary/15 rounded-md" />

              {/* Title Skeleton */}
              <Skeleton className="h-4 w-3/4 mt-3 bg-secondary/15 rounded" />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PartnerSkeleton;
