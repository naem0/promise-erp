import { Skeleton } from "@/components/ui/skeleton";

const BranchesSkeleton = () => {
  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-8 mb-2 min-w-52 bg-secondary/15" />
          <Skeleton className="h-5 min-w-3xs bg-secondary/15" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4"
            >
              {/* Logo Circle */}
              <div className="flex justify-center">
                <Skeleton className="w-20 h-20 rounded-full bg-secondary/15" />
              </div>

              {/* Branch Name */}
              <Skeleton className="h-5 w-32 rounded-md bg-secondary/15" />

              {/* Location Text */}
              <Skeleton className="h-4 w-24 rounded-md bg-secondary/15" />

              {/* Address (multi-line) */}
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-4 w-40 rounded-md bg-secondary/15" />
                <Skeleton className="h-4 w-36 rounded-md bg-secondary/15" />
                <Skeleton className="h-4 w-32 rounded-md bg-secondary/15" />
              </div>

              {/* Phone Numbers */}
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-4 w-32 rounded-md bg-secondary/15" />
                <Skeleton className="h-4 w-28 rounded-md bg-secondary/15" />
              </div>

              {/* Email */}
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSkeleton;
