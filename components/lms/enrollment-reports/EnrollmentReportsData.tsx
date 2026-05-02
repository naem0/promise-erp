import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table";
import { 
    CourseSalesReportItem, 
    getCourseSalesReportList 
} from "@/apiServices/enrollmentReportService";
import Pagination from "@/components/common/Pagination";

const EnrollmentReportsData = async ({
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
        course_id: typeof resolvedSearchParams.course_id === "string" ? resolvedSearchParams.course_id : undefined,
        branch_id: typeof resolvedSearchParams.branch_id === "string" ? resolvedSearchParams.branch_id : undefined,
        batch_id: typeof resolvedSearchParams.batch_id === "string" ? resolvedSearchParams.batch_id : undefined,
        report_type: typeof resolvedSearchParams.report_type === "string" ? resolvedSearchParams.report_type : undefined,
        sort_by: typeof resolvedSearchParams.sort_by === "string" ? resolvedSearchParams.sort_by : undefined,
        sort_order: typeof resolvedSearchParams.sort_order === "string" ? resolvedSearchParams.sort_order : undefined,
    };

    let results;
    try {
        results = await getCourseSalesReportList(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const reportList = results?.data?.report || [];
    const paginationData = results?.data?.pagination;
    const totals = results?.data?.totals;

    if (!results || !results?.success || !results?.data) {
        return  null;
    }

    if (!reportList?.length) {
        return (
            <NotFoundComponent message={results?.message || "No report data found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Branch Name</TableHead>
                            <TableHead className="text-center">Course Name</TableHead>
                            <TableHead className="text-center">Batch Name</TableHead>
                            <TableHead className="text-right">Total Enrollments</TableHead>
                            <TableHead className="text-right">Received</TableHead>
                            <TableHead className="text-right">Due</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {reportList.map((item: CourseSalesReportItem, index: number) => (
                            <TableRow key={`${item.branch_id}-${item.course_name}-${item.batch_name}-${index}`}>
                                <TableCell className="text-center">
                                    {(page - 1) * per_page + (index + 1)}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {item.branch_name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.course_name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.batch_name || "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.total_enrollments}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                    ৳ {item.received.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-red-500 font-medium">
                                    ৳ {item.due.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    
                    {totals && (
                        <TableFooter>
                            <TableRow className="font-bold text-base bg-muted/50">
                                <TableCell colSpan={4} className="text-right">Totals</TableCell>
                                <TableCell className="text-right">{totals.total_enrollments}</TableCell>
                                <TableCell className="text-right text-green-600">৳ {totals.received.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-red-500">৳ {totals.due.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
            
            {paginationData && paginationData.last_page > 1 && (
                <div className="mt-4 pb-6">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default EnrollmentReportsData;
