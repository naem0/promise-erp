// DivisionPage.tsx
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import DivisionFilterData from "@/components/division/DivisionFilterData";
import DivisionData from "@/components/division/DivisionData";
const DivisionPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  return (
          <div className="mx-auto space-y-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Division</h1>
          <Button asChild>
            <Link href="/divisions/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Division
            </Link>
          </Button>
        </div>

        <Suspense fallback={<div>Loading Search...</div>}>
          <DivisionFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
          <DivisionData searchParams={params} />
        </Suspense>
      </div>
      )
}

export default DivisionPage
