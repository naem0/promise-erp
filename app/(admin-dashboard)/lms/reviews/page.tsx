import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import ReviewsFilterData from "@/components/lms/reviews/ReviewsFilterData";
import ReviewsData from "@/components/lms/reviews/ReviewsData";

export default function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Reviews
        </h1>

        <Button asChild className="bg-green-600">
          <Link href="/lms/reviews/add">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Review
          </Link>
        </Button>
      </div>

      {/* Filter section */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <ReviewsFilterData />
      </Suspense>

      {/* Data Table */}
      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <ReviewsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
