import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WhyChooseUsSkeleton = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Image Skeleton */}
        <Card className="py-2 px-2 border border-secondary/30 shadow">
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </Card>

        <div>
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-40 mb-6" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="py-0 bg-secondary/10 border border-secondary/30">
                <CardContent className="flex gap-4 p-4">
                  {/* Icon Skeleton */}
                  <Skeleton className="w-[60px] h-[60px] rounded-full shrink-0" />

                  <div className="space-y-2 w-full">
                    {/* Heading */}
                    <Skeleton className="h-5 w-48" />

                    {/* Paragraph */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSkeleton;
