import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getCRMSources } from "@/apiServices/crmSourceService";
import Pagination from "@/components/common/Pagination";
import CRMSourcesTable from "./CRMSourcesTable";

const CRMSourcesData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page =
        typeof resolvedSearchParams.page === "string"
            ? Number(resolvedSearchParams.page)
            : 1;
    const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;
    
    const params = {
        page,
        per_page,
        search:
            typeof resolvedSearchParams.search === "string"
                ? resolvedSearchParams.search
                : undefined,
        status:
            typeof resolvedSearchParams.status === "string"
                ? resolvedSearchParams.status
                : undefined,
        sort_order:
            typeof resolvedSearchParams.sort_order === "string"
                ? resolvedSearchParams.sort_order
                : undefined,
    };

    let results;
    try {
        results = await getCRMSources(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    if (!results || !results?.data) {
        return null;
    }

    const sources = results?.data?.sources || [];
    const paginationData = results?.data?.pagination;

    if (!sources.length) {
        return (
            <NotFoundComponent message={results?.message || "No sources found."} />
        );
    }

    return (
        <>
            <CRMSourcesTable
                sources={sources}
                page={page}
                perPage={paginationData?.per_page || 15}
                totalSources={paginationData?.total || 0}
            />
            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default CRMSourcesData;
