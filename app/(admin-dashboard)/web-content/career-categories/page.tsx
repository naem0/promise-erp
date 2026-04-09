import CareerCategoriesFilterNav from "@/components/web-content/career-categories/CareerCategoriesFilterNav";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import CareerCategoriesData from "@/components/web-content/career-categories/CareerCategoriesData";
import TableSkeleton from "@/components/TableSkeleton";

export interface CareerCategoryParams {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import PermissionGuard from "@/components/auth/PermissionGuard";

const CareerCategoriesPage = ({ searchParams }: CareerCategoryParams) => {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Career Categories</h1>
                <PermissionGuard requiredPermission="create-career-categories">
                    <Button asChild>
                        <Link href="/web-content/career-categories/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Career Category
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>
            <Suspense fallback={<div>Loading filters...</div>}>
                <CareerCategoriesFilterNav />
            </Suspense>
            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <CareerCategoriesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
};

export default CareerCategoriesPage;
