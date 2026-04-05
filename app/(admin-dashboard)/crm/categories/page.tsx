import CategoriesData from "@/components/crm/categories/CategoriesData";
import CategoriesFilter from "@/components/crm/categories/CategoriesFilter";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">CRM Categories</h1>

                <PermissionGuard requiredPermission="create-crm-categories">
                    <Button asChild >
                        <Link href="/crm/categories/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Category
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <CategoriesFilter />

            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <CategoriesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
