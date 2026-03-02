import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StoriesSectionSkeleton = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="py-0 bg-secondary/10 ">
              <CardContent className="p-4 flex gap-4 items-center">
                {/* Left Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between lg:flex-row flex-col gap-2">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    <Skeleton className="h-4 w-20 shrink-0" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                  </div>
                </div>

                {/* Image */}
                <Skeleton className="w-30 h-30 rounded-lg shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesSectionSkeleton;
