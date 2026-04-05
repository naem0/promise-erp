import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CouponFilterData from "@/components/lms/coupons/CouponFilterData";
import CouponsData from "@/components/lms/coupons/CouponsData";

import PermissionGuard from "@/components/auth/PermissionGuard";

const CouponsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Coupons</h1>
        </div>
        <PermissionGuard requiredPermission="create-coupons">
          <Button asChild size="lg" className="rounded-xl shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
            <Link href="/lms/coupons/add">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Coupon
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded-xl" />}>
        <CouponFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <CouponsData searchParams={params} />
      </Suspense>
    </div>
  );
};


export default CouponsPage;
