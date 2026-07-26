import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CategoryFilterData from "@/components/lms/categories/CategoryFilterData";
import CategoriesData from "@/components/lms/categories/CategoriesData";
import PermissionGuard from "@/components/auth/PermissionGuard";
import CategoriesSummaryWrapper from "@/components/lms/categories/CategoriesSummaryWrapper";

const CategoriesPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
          <div className="mx-auto space-y-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Category</h1>
          <PermissionGuard requiredPermission="create-course-categories">
            <Button asChild>
              <Link href="/lms/categories/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense
            fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-400 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            }
        >
            <CategoriesSummaryWrapper />
        </Suspense>

        <Suspense fallback={<div>Loading Search...</div>}>
          <CategoryFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
          <CategoriesData searchParams={searchParams} />
        </Suspense>
      </div>
      )
}

export default CategoriesPage