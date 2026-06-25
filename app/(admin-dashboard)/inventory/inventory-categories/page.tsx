import CategoriesData from "@/components/inventory/inventory-categories/CategoriesData";
import CategoriesFilterData from "@/components/inventory/inventory-categories/CategoriesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import CategoriesSummaryWrapper from "@/components/inventory/CategoriesSummaryWrapper";

export default function InventoryCategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Product Categories</h1>

                <PermissionGuard requiredPermission="create-product-categories">
                    <Button asChild className="">
                        <Link href="/inventory/inventory-categories/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Category
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-400 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                }
            >
                <CategoriesSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <CategoriesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <CategoriesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
