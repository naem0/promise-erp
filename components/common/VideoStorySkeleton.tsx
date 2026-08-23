import { Skeleton } from "@/components/ui/skeleton";

const VideoStorySkeleton = () => {
  return (
    <section className=" bg-cover bg-no-repeat bg-center py-10 lg:py-16">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-3xs bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-5">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl bg-secondary/15" />
            <Skeleton className="absolute w-16 h-16 bg-secondary/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl bg-secondary/15" />
            <Skeleton className="absolute w-16 h-16 bg-secondary/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl bg-secondary/15" />
            <Skeleton className="absolute w-16 h-16 bg-secondary/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl bg-secondary/15" />
            <Skeleton className="absolute w-16 h-16 bg-secondary/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoStorySkeleton;
