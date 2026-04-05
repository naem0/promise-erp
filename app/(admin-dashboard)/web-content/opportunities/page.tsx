import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";  
import OpportunitiesFilterData from "@/components/web-content/opportunities/OpportunitiesFilterData";
import OpportunitiesData from "@/components/web-content/opportunities/OpportunitiesData";  
import PermissionGuard from "@/components/auth/PermissionGuard";

const OpportunitiesPage = ({
  searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
        <PermissionGuard requiredPermission="create-opportunities">
          <Button asChild>
              <Link href="/web-content/opportunities/add">  
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Opportunity
              </Link>
          </Button>
        </PermissionGuard>
        </div>
        <Suspense fallback={<div>Loading Search...</div>}>
        <OpportunitiesFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <OpportunitiesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};  
export default OpportunitiesPage;