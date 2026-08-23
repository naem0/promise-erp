import { Skeleton } from "@/components/ui/skeleton";

const HomeHeroSkeleton = () => {
  return (
    <section className="bg-secondary/5 relative min-h-[420px] md:min-h-[500px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
          {/* LEFT CONTENT SKELETON */}
          <div className="flex flex-col justify-center pe-0 lg:pe-4 py-8 xl:py-18">
            <Skeleton className="h-12 w-3/4 mb-4 rounded-md bg-secondary/15" />
            <Skeleton className="h-6 w-full mb-2 rounded-md bg-secondary/15" />
            <Skeleton className="h-6 w-5/6 mb-6 rounded-md bg-secondary/15" />

            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-36 rounded-md bg-secondary/15" />
              <Skeleton className="h-12 w-36 rounded-md bg-secondary/15" />
            </div>
          </div>

          {/* RIGHT VIDEO / FEATURE IMAGE SKELETON */}
          <div className="py-10 pt-0 md:py-18">
            <div className="rounded-2xl overflow-hidden border-6 min-h-[250px] sm:min-h-[325px] lg:min-h-[425px] border-white relative bg-black/5">
              <Skeleton className="absolute inset-0 w-full h-full bg-secondary/15" />
              <Skeleton className="absolute w-16 h-16 bg-secondary/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSkeleton;
