import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AboutBranchSkeleton = () => {
  return (
    <Card className="flex flex-col xl:flex-row gap-4 px-4 py-3 bg-primary/10 border border-primary/50 rounded-lg">
      {/* Map Skeleton */}
      <div className="relative h-[162px] w-full xl:w-[200px] shrink-0 overflow-hidden rounded-lg border border-primary/50">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="flex-1 px-2 flex flex-col py-1 space-y-3">
        {/* Title */}
        <CardHeader className="p-0">
          <Skeleton className="h-5 w-40" />
        </CardHeader>

        {/* Address */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-1" />
          <Skeleton className="h-4 w-full max-w-[250px]" />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>

      {/* Call Button Skeleton */}
      <CardFooter className="flex items-end p-0">
        <Skeleton className="h-10 w-10 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export default AboutBranchSkeleton;
