import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ContactMapSkeleton = () => {
  return (
    <Card className="h-full py-0 animate-pulse">
      <CardHeader className="pt-4">
        <CardTitle className="text-xl md:text-2xl text-secondary">
          <Skeleton className="h-6 w-48 md:w-64" />
        </CardTitle>
        <p className="text-secondary text-sm mt-2">
          <Skeleton className="h-4 w-64 md:w-80" />
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map Skeleton */}
        <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-muted">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>

        {/* Address Skeleton */}
        <div className="flex items-start gap-3 p-3 bg-secondary/15 rounded-xl">
          <div className="bg-secondary rounded-full p-2 shrink-0">
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40 md:w-60" />
            <Skeleton className="h-4 w-full md:w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMapSkeleton;
