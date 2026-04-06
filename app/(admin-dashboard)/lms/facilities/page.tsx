import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import FacilitiesFilterData from "@/components/lms/facilities/FacilitiesFilterData";
import FacilitiesData from "@/components/lms/facilities/FacilitiesData";

import PermissionGuard from "@/components/auth/PermissionGuard";

const FacilitiesPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Facility</h1>
        <PermissionGuard requiredPermission="create-course-facilities">
          <Button asChild>
            <Link href="/lms/facilities/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Facility
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading Search...</div>}>
        <FacilitiesFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <FacilitiesData searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default FacilitiesPage

