import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BranchStateSkeleton = () => {
  return (
    <section className="pt-8 md:pt-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 w-full">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="py-3 gap-2 border-none shadow-lg bg-secondary/20 text-white">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-3">
                {/* Icon Skeleton */}
                <Skeleton className="h-12 w-12 rounded-lg" />

                {/* Count Skeleton */}
                <Skeleton className="h-6 w-1/3 rounded-md" />

                {/* Title Skeleton */}
                <Skeleton className="h-6 w-1/3 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchStateSkeleton;
