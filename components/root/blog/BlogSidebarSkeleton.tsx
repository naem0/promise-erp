import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const BlogSidebarSkeleton = () => {
  return (
    <div className="space-y-6 w-full max-w-sm">
      {/* Categories Skeleton */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>

        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-xl bg-muted p-3"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags Skeleton */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Skeleton key={item} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebarSkeleton;
