import CareersData from "@/components/lms/careers/CareersData";
import CareersFilterData from "@/components/lms/careers/CareersFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface CareersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function CareersPage({ searchParams }: CareersPageProps) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Careers
        </h1>

        <PermissionGuard requiredPermission="create-careers">
          <Button asChild className="bg-green-600">
            <Link href="/lms/careers/add" prefetch={true}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Career
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <CareersFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <CareersData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
