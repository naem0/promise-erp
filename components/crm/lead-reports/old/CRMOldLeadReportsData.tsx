import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getCRMOldLeadReports } from "@/apiServices/crmLeadReportsService";
import Pagination from "@/components/common/Pagination";
import CRMOldLeadReportsTable from "./CRMOldLeadReportsTable";
import CRMOldLeadReportsExportButton from "./CRMOldLeadReportsExportButton";

const CRMOldLeadReportsData = async ({
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
        consultant_id:
            typeof resolvedSearchParams.consultant_id === "string"
                ? resolvedSearchParams.consultant_id
                : undefined,
        branch_id:
            typeof resolvedSearchParams.branch_id === "string"
                ? resolvedSearchParams.branch_id
                : undefined,
        course_id:
            typeof resolvedSearchParams.course_id === "string"
                ? resolvedSearchParams.course_id
                : undefined,
        status:
            typeof resolvedSearchParams.status === "string"
                ? resolvedSearchParams.status
                : undefined,
        date_from:
            typeof resolvedSearchParams.date_from === "string"
                ? resolvedSearchParams.date_from
                : undefined,
        date_to:
            typeof resolvedSearchParams.date_to === "string"
                ? resolvedSearchParams.date_to
                : undefined,
    };

    let results;
    try {
        results = await getCRMOldLeadReports(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    if (!results || results?.data) {
        return null;
    }

    const reportData = results?.data?.report_data || [];
    const summary = results?.data?.total_summary;
    const paginationData = results?.data?.pagination;

    if (!reportData.length) {
        return (
            <NotFoundComponent message={results?.message || "No old lead report data found."} />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <CRMOldLeadReportsExportButton
                    data={reportData}
                    page={page}
                    perPage={per_page}
                />
            </div>

            <CRMOldLeadReportsTable
                data={reportData}
                summary={summary}
                page={page}
                perPage={per_page}
            />

            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </div>
    );
};

export default CRMOldLeadReportsData;
