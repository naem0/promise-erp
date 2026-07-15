import { Skeleton } from "@/components/ui/skeleton";

const TeamMemberCardSkeleton = () => {
  const count = 2;
  return (
    <div className="space-y-8 max-w-full lg:max-w-6xl mx-auto py-8 lg:py-14">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="grid md:grid-cols-[1fr_220px] border rounded-xl shadow-md bg-secondary/10 "
        >
          {/* Content Skeleton */}
          <div className="px-4 py-6 space-y-4">
            {/* Name + Designation */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>

            {/* Message */}
            <div className="mt-6 space-y-3">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
              <div className="flex justify-end mt-4">
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          </div>

          {/* Avatar Skeleton */}
          <div className="hidden md:flex items-center justify-end p-4">
            <div className="p-3 relative rounded-lg bg-muted h-full md:w-[75%] flex items-center justify-center">
              <div className="absolute -left-10 bg-white rounded-full p-1 h-36 w-36 shadow-md flex justify-center items-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberCardSkeleton;
