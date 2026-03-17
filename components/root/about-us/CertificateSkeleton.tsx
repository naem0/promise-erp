import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CertificateSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-2 items-center rounded-xl gap-4 bg-secondary/10 shadow p-2 h-full">
      
      {/* Image Skeleton */}
      <Card className="py-0 shadow-none">
        <CardContent className="p-2 flex justify-center">
          <div className="relative w-full h-[280px] md:h-[380px]">
            <Skeleton className="w-full h-full rounded-lg bg-white/50" />
          </div>
        </CardContent>
      </Card>

      {/* Text Skeleton */}
      <div className="px-4 py-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 bg-white/50" />

        {/* Description lines */}
        <Skeleton className="h-4 w-full bg-white/50" />
        <Skeleton className="h-4 w-[90%] bg-white/50" />
        <Skeleton className="h-4 w-[80%] bg-white/50" />
      </div>
    </div>
  );
};

export default CertificateSkeleton;