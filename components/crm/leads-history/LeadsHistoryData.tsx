import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeadHistory, getLeadsHistory } from "@/apiServices/crmLeadsHistoryService";
import Pagination from "@/components/common/Pagination";
import LeadHistoryAction from "./LeadHistoryAction";

import { truncate } from "@/lib/utils";

const LeadsHistoryData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
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
        user_id:
            typeof resolvedSearchParams.user_id === "string"
                ? resolvedSearchParams.user_id
                : undefined,
    };

    let results;
    try {
        results = await getLeadsHistory(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const histories = results?.data?.histories || [];
    const paginationData = results?.data?.pagination;

    if (!histories.length) {
        return (
            <NotFoundComponent message={results?.message || "No leads history found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                            <TableHead className="text-center">Lead Name</TableHead>
                            <TableHead className="text-center">Last Follow Up</TableHead>
                            <TableHead className="text-center">Next Follow Up</TableHead>
                            <TableHead className="text-center">Calls</TableHead>
                            <TableHead className="text-center">Messages</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Consultant</TableHead>
                            <TableHead className="text-center">Note</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {histories.map((history: LeadHistory, index: number) => (
                            <TableRow key={history?.id}>
                                <TableCell className="text-center">
                                    {(page - 1) * per_page + (index + 1)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <LeadHistoryAction
                                        leadId={history?.lead_id || history?.id}
                                        leadName={history?.lead_name || "Lead"}
                                    />
                                </TableCell>

                                <TableCell className="text-center font-medium">
                                    {history?.lead_name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {history?.last_follow_up_date || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {history?.next_follow_up_date || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {history?.call_count ?? 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    {history?.message_count ?? 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline">
                                        {history?.status_text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col">
                                        <span>{history?.user_name}</span>
                                        <span className="text-xs text-secondary">{history?.user_designation}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] text-center" title = {history?.note}>
                                    {truncate(history?.note || "", 20)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {paginationData?.last_page > 1 && (
                <div className="mt-4 pb-6">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default LeadsHistoryData;
