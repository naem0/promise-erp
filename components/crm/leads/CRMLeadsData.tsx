
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getCRMLeads } from "@/apiServices/crmLeadsService";
import { Consultant, getConsultants } from "@/apiServices/crmLeadsActions";
import Pagination from "@/components/common/Pagination";
import CRMLeadsClientTable from "./CRMLeadsClientTable";

const CRMLeadsData = async ({
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
        sort_order:
            typeof resolvedSearchParams.sort_order === "string"
                ? resolvedSearchParams.sort_order
                : undefined,
        status:
            typeof resolvedSearchParams.status === "string"
                ? resolvedSearchParams.status
                : undefined,
        source:
            typeof resolvedSearchParams.source === "string"
                ? resolvedSearchParams.source
                : undefined,
        course_type:
            typeof resolvedSearchParams.course_type === "string"
                ? resolvedSearchParams.course_type
                : undefined,
        branch_id:
            typeof resolvedSearchParams.branch_id === "string"
                ? resolvedSearchParams.branch_id
                : undefined,
        category_id:
            typeof resolvedSearchParams.category_id === "string"
                ? resolvedSearchParams.category_id
                : undefined,
    };

    let results;
    try {
        results = await getCRMLeads(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const leads = results?.data?.leads || [];
    const paginationData = results?.data?.pagination;

    if (!leads.length) {
        return (
            <NotFoundComponent message={results?.message || "No leads found."} />
        );
    }

    // Fetch consultants for the assign modal
    let consultants: Consultant[] = [];
    try {
        const consultantsRes = await getConsultants();
        consultants = consultantsRes?.data?.consultants || [];
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    return (
        <>
            <CRMLeadsClientTable
                leads={leads}
                page={page}
                perPage={paginationData?.per_page || 15}
                consultants={consultants}
            />
            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default CRMLeadsData;
