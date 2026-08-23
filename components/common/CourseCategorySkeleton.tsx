import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CourseCategorySkeleton = () => {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto">
        
        {/* Title Skeleton */}
        <div className="flex flex-col gap-4 items-center mb-8">
          <Skeleton className="h-8 w-48 rounded-md bg-secondary/15" />
          <Skeleton className="h-6 w-72 rounded-md bg-secondary/15" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="rounded-2xl flex flex-col items-center justify-center py-10 bg-secondary/15"
            >
              <CardContent className="flex flex-col items-center gap-4">

                {/* Circle Image Placeholder */}
                <Skeleton className="h-20 w-20 rounded-full bg-secondary/20" />

                {/* Title Placeholder */}
                <Skeleton className="h-6 w-40 rounded-md bg-secondary/20" />

                {/* Button Placeholder */}
                <Skeleton className="h-10 w-32 rounded-lg bg-secondary/20" />

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategorySkeleton;
