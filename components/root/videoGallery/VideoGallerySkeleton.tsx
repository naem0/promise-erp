import { Skeleton } from "@/components/ui/skeleton";

const VideoGallerySkeleton = () => {
  // Number of placeholder videos
  const skeletonCount = 8;

  return (
    <div className="container mx-auto px-4 py-8 md:py-14">
      {/* ================= FIRST VIDEO SKELETON ================= */}
      <section>
        <div className="relative bg-secondary/15 overflow-hidden rounded-2xl">
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      </section>

      {/* ================= GRID VIDEO SKELETON ================= */}
      <section className="pt-8 md:pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <div
              key={idx}
              className="relative bg-secondary/15 overflow-hidden rounded-2xl"
            >
              <Skeleton className="aspect-video w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VideoGallerySkeleton;
