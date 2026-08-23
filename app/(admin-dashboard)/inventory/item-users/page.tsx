import ItemUsersData from "@/components/inventory/item-users/ItemUsersData";
import ItemUsersFilter from "@/components/inventory/item-users/ItemUsersFilter";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import ItemUsersSummaryWrapper from "@/components/inventory/ItemUsersSummaryWrapper";

export default function ItemUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6" suppressHydrationWarning>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Item Users
        </h1>

        <div className="flex items-center gap-2">
          <PermissionGuard requiredPermission="create-product-users">
            <Button asChild>
              <Link href="/inventory/item-users/add">
                <PlusCircle className="w-4 h-4 mr-2" />Assign Items
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        }
      >
        <ItemUsersSummaryWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ItemUsersFilter />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <ItemUsersData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
