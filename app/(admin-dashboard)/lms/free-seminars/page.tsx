import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import FreeSeminarsFilterData from "@/components/lms/free-seminars/FreeSeminarsFilterData";
import FreeSeminarsData from "@/components/lms/free-seminars/FreeSeminarsData";
const FreeSeminarsPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Free Seminars</h1>
        <Button asChild>
          <Link href="/lms/free-seminars/add">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Free Seminar
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading Search...</div>}>
        <FreeSeminarsFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <FreeSeminarsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};
export default FreeSeminarsPage;
