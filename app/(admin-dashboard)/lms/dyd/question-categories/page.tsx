import DydQuestionCategoriesData from "@/components/lms/dyd/question-categories/DydQuestionCategoriesData";
import DydQuestionCategoriesFilterData from "@/components/lms/dyd/question-categories/DydQuestionCategoriesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function DydQuestionCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            DYD Question Categories
          </h1>
        </div>

        <PermissionGuard requiredPermission="create-dyd-question-categories">
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white cursor-pointer w-full sm:w-auto">
            <Link href="/lms/dyd/question-categories/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Question Category</span>
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <DydQuestionCategoriesFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <DydQuestionCategoriesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
