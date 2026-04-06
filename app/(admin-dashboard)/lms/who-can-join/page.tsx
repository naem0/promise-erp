import WhoCanJoinData from "@/components/lms/who-can-join/WhoCanJoinData";
import JoinFilterData from "@/components/lms/who-can-join/JoinFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";

export default function WhoCanJoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Who Can Join</h1>

        <PermissionGuard requiredPermission="create-course-joins">
          <Button asChild>
            <Link href="/lms/who-can-join/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Join
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <JoinFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={4} rows={10} />}>
        <WhoCanJoinData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
