import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import OurPartnersFilterData from "@/components/web-content/our-partners/OurPartnersFilterData";
import OurPartnersData from "@/components/web-content/our-partners/OurPartnersData";
import PermissionGuard from "@/components/auth/PermissionGuard";

const OurPartnersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Our Partners</h1>
        <PermissionGuard requiredPermission="create-partners">
          <Button asChild>
            <Link href="/web-content/our-partners/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Partner
            </Link>
          </Button>
        </PermissionGuard>
      </div>
      <Suspense fallback={<div>Loading Search...</div>}>
        <OurPartnersFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <OurPartnersData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};
export default OurPartnersPage;
