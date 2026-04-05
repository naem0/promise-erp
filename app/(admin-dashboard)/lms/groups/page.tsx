
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import GroupFilterData from "@/components/lms/groups/GroupFilterData";
import GroupsData from "@/components/lms/groups/GroupsData";

import PermissionGuard from "@/components/auth/PermissionGuard";

const GroupsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;


  return (
    <div className="mx-auto space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
        <PermissionGuard requiredPermission="create-groups">
          <Button asChild>
            <Link href="/lms/groups/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Group
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading Search...</div>}>
        <GroupFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={9} rows={8} />}>
        <GroupsData searchParams={params} />
      </Suspense>
    </div>
  )
}

export default GroupsPage
