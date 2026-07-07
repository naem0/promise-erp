import { Suspense } from "react";
import AchievementsData from "@/components/web-content/about-page/achievements/AchievementsData";
import AchievementsFilterData from "@/components/web-content/about-page/achievements/AchievementsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";


export default function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Achievements
          </h1>

          <PermissionGuard requiredPermission="create-achievements">
            <Button asChild className="">
              <Link href="/web-content/about-page/achievements/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Achievement
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <AchievementsFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <AchievementsData searchParams={searchParams} />
        </Suspense>
      </div>
  );
}
