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

    const getStatusStyles = (status: number) => {
        switch (status) {
            case 1:
                return "border-[#2D76E5]/20 text-[#2D76E5] bg-[#2D76E5]/10";
            case 2:
                return "border-[#E67E00]/20 text-[#E67E00] bg-[#E67E00]/10";
            case 3:
                return "border-[#00B686]/20 text-[#00B686] bg-[#00B686]/10";
            case 4:
                return "border-[#9148EF]/20 text-[#9148EF] bg-[#9148EF]/10";
            case 5:
                return "border-[#E64A6E]/20 text-[#E64A6E] bg-[#E64A6E]/10";
            case 6:
                return "border-[#00B8E6]/20 text-[#00B8E6] bg-[#00B8E6]/10";
            default:
                return "";
        }
    };

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
                            <TableHead className="text-center">Consultant</TableHead>
                            <TableHead className="text-center">Status</TableHead>
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
                                    <div className="flex flex-col">
                                        <span>{history?.user_name}</span>
                                        <span className="text-xs text-secondary">{history?.user_designation}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={getStatusStyles(history?.status)}
                                    >
                                        {history?.status_text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-[200px] text-center" title={history?.note}>
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
