

import { Card, CardContent } from "@/components/ui/card";

const OurAchievementSkeleton = () => {
  return (
    <section className="pt-8 md:pt-14 animate-pulse">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="h-8 w-60 bg-gray-200 mx-auto rounded" />
      </div>

      {/* Card */}
      <Card className="py-0 bg-secondary/10">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            
            {/* Image Skeleton */}
            <div className="w-full h-[300px] md:h-[400px] bg-gray-200" />

            {/* Content Skeleton */}
            <div className="flex flex-col justify-center px-4 py-4 md:py-6 space-y-4">
              
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OurAchievementSkeleton;