import FaqsData from "@/components/lms/faqs/FaqsData";
import FaqsFilterData from "@/components/lms/faqs/FaqsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import PermissionGuard from "@/components/auth/PermissionGuard";

export default function FaqsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">FAQs</h1>

                <PermissionGuard requiredPermission="create-faqs">
                    <Button asChild>
                        <Link href="/lms/faqs/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add FAQ
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <FaqsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
                <FaqsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
