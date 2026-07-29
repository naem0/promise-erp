
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getCRMLeads } from "@/apiServices/crmLeadsService";
import { Consultant, getConsultants } from "@/apiServices/crmLeadsActions";
import Pagination from "@/components/common/Pagination";
import CRMLeadsClientTable from "./CRMLeadsClientTable";
import { getBranches } from "@/apiServices/branchService";

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
        shift:
            typeof resolvedSearchParams.shift === "string"
                ? resolvedSearchParams.shift
                : undefined,
        course_id:
            typeof resolvedSearchParams.course_id === "string"
                ? resolvedSearchParams.course_id
                : undefined,
        user_id:
            typeof resolvedSearchParams.user_id === "string"
                ? resolvedSearchParams.user_id
                : undefined,
        date_from:
            typeof resolvedSearchParams.date_from === "string"
                ? resolvedSearchParams.date_from
                : undefined,
        date_to:
            typeof resolvedSearchParams.date_to === "string"
                ? resolvedSearchParams.date_to
                : undefined,
        assignment_status:
            typeof resolvedSearchParams.assignment_status === "string"
                ? resolvedSearchParams.assignment_status
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
    
    let branches: { id: number; name: string }[] = [];
    try {
        const branchesRes = await getBranches({ per_page: 500 });
        branches = branchesRes?.data?.branches || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
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
                branches={branches}
                totalLeads={paginationData?.total || 0}
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
