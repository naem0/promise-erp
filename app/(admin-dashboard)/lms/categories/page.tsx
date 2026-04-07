import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CategoryFilterData from "@/components/lms/categories/CategoryFilterData";
import CategoriesData from "@/components/lms/categories/CategoriesData";
import PermissionGuard from "@/components/auth/PermissionGuard";

const CategoriesPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
          <div className="mx-auto space-y-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Category</h1>
          <PermissionGuard requiredPermission="create-career-categories">
            <Button asChild>
              <Link href="/lms/categories/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </PermissionGuard>
        </div>

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