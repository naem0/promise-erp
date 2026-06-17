import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import LeadsActivityData from "./LeadActivitiesData";

export default async function LeadActivitiesTableSection({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolved = await searchParams;
    const queryString = new URLSearchParams(
        Object.entries(resolved)
            .filter(([, v]) => v !== undefined)
            .flatMap(([k, v]) =>
                Array.isArray(v) ? v.map((val) => [k, val]) : [[k, String(v)]]
            )
    ).toString();

    return (
        <Suspense key={queryString} fallback={<TableSkeleton columns={8} rows={10} />}>
            <LeadsActivityData resolvedSearchParams={resolved} queryString={queryString} />
        </Suspense>
    );
}
