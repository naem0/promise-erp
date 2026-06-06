import { Skeleton } from "@/components/ui/skeleton";

interface InvoicesLoadingProps {
  showSummary?: boolean;
}

export function InvoicesLoading({ showSummary = true }: InvoicesLoadingProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg border overflow-hidden p-4 space-y-3">
        {/* Table Header */}
        <Skeleton className="h-10 w-full rounded" />
        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded" />
        ))}
      </div>
    </div>
  );
}
