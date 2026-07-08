import { Suspense } from "react";
import LicensesData from "@/components/web-content/about-page/licenses/LicensesData";
import LicensesFilterData from "@/components/web-content/about-page/licenses/LicensesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";


export default function LicensesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <PermissionGuard requiredPermission="view-licenses">
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Licenses & Certifications
          </h1>

          <PermissionGuard requiredPermission="create-licenses">
            <Button asChild className="">
              <Link href="/web-content/about-page/licenses/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add License
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <LicensesFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <LicensesData searchParams={searchParams} />
        </Suspense>
      </div>
    </PermissionGuard>
  );
}
