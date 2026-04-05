
import BlogCategoriesFilterNav from "@/components/web-content/blog-categories/BlogCategoriesFilterNav";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import BlogCategoriesData from "@/components/web-content/blog-categories/BlogCategoriesData";
import TableSkeleton from "@/components/TableSkeleton";

export interface BlogParams {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import PermissionGuard from "@/components/auth/PermissionGuard";

const BlogCategoriesPage = ({ searchParams }: BlogParams) => {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Blog Categories</h1>
                <PermissionGuard requiredPermission="create-blog-categories">
                    <Button asChild>
                        <Link href="/web-content/blog-categories/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Blog Category
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>
            <Suspense fallback={<div>Loading filters...</div>}>
                <BlogCategoriesFilterNav />
            </Suspense>
            <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
                <BlogCategoriesData searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default BlogCategoriesPage;