import { Skeleton } from "@/components/ui/skeleton";

const AdminUsersStatSkeleton = () => {
  return (
    <div className="rounded-xl p-4 bg-secondary/40 shadow-md animate-pulse">
      {/* Title Skeleton */}
      <div className="pb-2">
        <Skeleton className="h-8 xl:h-10 w-3/4 rounded-md bg-white/30" />
      </div>

      {/* Main Stat Skeleton */}
      <div className="pb-2">
        <Skeleton className="h-12 xl:h-16 w-1/2 rounded-md bg-white/30" />
      </div>

      {/* Grid of smaller stats */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1 bg-black/20 rounded-lg py-2 px-3">
              <Skeleton className="h-4 mb-1 w-3/4 rounded-md bg-white/30" /> {/* Title */}
              <Skeleton className="h-8 w-full rounded-md bg-white/30" /> {/* Value */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersStatSkeleton;