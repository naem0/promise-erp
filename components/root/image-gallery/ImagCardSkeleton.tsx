import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ImagCardSkeleton = () => {
  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card className="py-0 gap-2 bg-secondary/10" key={i}>
              <CardContent className="p-3 pb-0">
                <div className="relative w-full h-[250px] lg:h-[350px] rounded-lg overflow-hidden">
                  {/* Image Skeleton */}
                  <Skeleton className="w-full h-full rounded-lg bg-white/60" />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-3 p-3">
                {/* Title Skeleton */}
                <Skeleton className="h-4 w-full bg-white/60" />

                {/* Button Skeleton */}
                <Skeleton className="h-9 w-full rounded-md bg-white/60" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImagCardSkeleton;
