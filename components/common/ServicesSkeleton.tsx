import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export default function ServicesSkeleton() {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        
        {/* Section Title Skeleton */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Skeleton className="h-8 w-40 bg-secondary/15" />
          <Skeleton className="h-6 w-64 bg-secondary/15" />
        </div>

        {/* =============== 1st ROW =============== */}
        <div className="md:mb-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-20">

          {[1, 2].map((i) => (
            <Card
              key={i}
              className="p-6 bg-secondary/15 border-0 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32 bg-white/40" />
                  <Skeleton className="h-4 w-48 bg-white/30" />
                </div>
              </div>
            </Card>
          ))}

        </div>

        {/* =============== 2nd ROW =============== */}
        <div className="md:mb-6 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

          {/* LEFT COLUMN (2 cards) */}
          <div className="flex flex-col gap-4 md:gap-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="p-6 bg-secondary/15 border-0 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-white/40" />
                    <Skeleton className="h-4 w-48 bg-white/30" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* MIDDLE BIG IMAGE Skeleton */}
          <div className="hidden md:flex justify-center">
            <Skeleton className="h-[220px] w-[220px] rounded-full bg-secondary/15" />
          </div>

          {/* RIGHT COLUMN (2 cards) */}
          <div className="flex flex-col gap-4 md:gap-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="p-6 bg-secondary/15 border-0 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-white/40" />
                    <Skeleton className="h-4 w-48 bg-white/30" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>

        {/* =============== 3rd ROW =============== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-20">

          {[1, 2].map((i) => (
            <Card
              key={i}
              className="p-6 bg-secondary/15 border-0 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-white/40" />
                  <Skeleton className="h-4 w-48 bg-white/30" />
                </div>
              </div>
            </Card>
          ))}

        </div>

      </div>
    </section>
  );
};