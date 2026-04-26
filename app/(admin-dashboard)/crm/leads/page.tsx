import CRMLeadsData from "@/components/crm/leads/CRMLeadsData";
import CRMLeadsFilterData from "@/components/crm/leads/CRMLeadsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function CRMLeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">CRM Leads</h1>
                <div className="flex justify-end gap-3 pt-4">
                    <Button asChild className="bg-green-600">
                        <Link href="/crm/leads/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Lead
                        </Link>
                    </Button>
                </div>

            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <CRMLeadsFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
                <CRMLeadsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
