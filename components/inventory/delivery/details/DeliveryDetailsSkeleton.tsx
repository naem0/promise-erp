import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeliveryDetailsSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Top 3 Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-5 flex items-start gap-4 bg-white">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requested Items Card Skeleton */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
            {/* Table Header skeleton */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-3 flex justify-between gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-5 w-16" />
                ))}
              </div>
              {/* Table Rows skeleton */}
              <div className="p-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between gap-4 py-2 border-b last:border-0">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <Skeleton key={j} className="h-5 w-16" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Box Skeleton */}
          <div className="border rounded-xl p-4 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="space-y-6 bg-white border rounded-xl p-6">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-11 w-full rounded-md mt-4" />
        </div>
      </div>
    </div>
  );
}
