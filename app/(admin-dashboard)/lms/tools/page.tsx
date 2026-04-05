import ToolsData from "@/components/lms/tools/ToolsData";
import ToolsFilterData from "@/components/lms/tools/ToolsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ToolsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>

                <PermissionGuard requiredPermission="create-tools">
                    <Button asChild>
                        <Link href="/lms/tools/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Tool
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <ToolsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
                <ToolsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
