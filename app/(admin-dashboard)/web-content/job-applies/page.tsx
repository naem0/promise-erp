import JobAppliesData from "@/components/web-content/job-applies/JobAppliesData";
import JobAppliesFilterData from "@/components/web-content/job-applies/JobAppliesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function JobAppliesPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Job Applications
                </h1>

                <Button asChild className="bg-green-600">
                    <Link href="/web-content/job-applies/add">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Application
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <JobAppliesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
                <JobAppliesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}