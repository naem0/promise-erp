import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function NewsfeedsArchiveSkeleton() {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Title Section Skeleton */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-3xs bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
          {/* Main Featured News Skeleton */}
          <Card className="border border-secondary/30 py-0 overflow-hidden">
            <AspectRatio ratio={1 / 1} className="w-full relative">
              <Skeleton className="w-full h-full bg-secondary/15" />
            </AspectRatio>
          </Card>

          {/* Other News Items Skeleton (2x2 grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="border border-secondary/30 py-0 overflow-hidden"
              >
                <AspectRatio ratio={1 / 1} className="w-full relative">
                  <Skeleton className="w-full h-full bg-secondary/15" />
                </AspectRatio>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Button Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-32 bg-secondary/15 rounded-md" />
        </div>
      </div>
    </section>
  );
}

