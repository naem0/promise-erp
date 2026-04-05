// DistrictsPage.tsx
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import DistrictFilterData from "@/components/districts/DistrictFilterData";
import DistrictData from "@/components/districts/DistrictData";
import PermissionGuard from "@/components/auth/PermissionGuard";

const DistrictsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;


  return (
    <div className="mx-auto space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">District</h1>
        <PermissionGuard requiredPermission="create-districts">
          <Button asChild>
            <Link href="/districts/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add District
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading Search...</div>}>
        <DistrictFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <DistrictData searchParams={params} />
      </Suspense>
    </div>
  )
}

export default DistrictsPage
