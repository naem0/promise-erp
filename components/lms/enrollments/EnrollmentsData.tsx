
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
import Pagination from "@/components/common/Pagination";
import { getEnrollments } from "@/apiServices/enrollmentService";
import EnrollmentActionMenu from "./EnrollmentActionMenu";
import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/utils";


export default async function EnrollmentsData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
    const per_page = typeof searchParams.per_page === "string" ? Number(searchParams.per_page) : 15;

    const params = {
        page,
        per_page,
        search:
            typeof searchParams.search === "string"
                ? searchParams.search
                : undefined,
        sort_order:
            typeof searchParams.sort_order === "string"
                ? searchParams.sort_order
                : "desc",
        batch_id:
            typeof searchParams.batch_id === "string"
                ? searchParams.batch_id
                : undefined,
        branch_id:
            typeof searchParams.branch_id === "string"
                ? searchParams.branch_id
                : undefined,
        course_id:
            typeof searchParams.course_id === "string"
                ? searchParams.course_id
                : undefined,
    };

    let data;
    try {
        data = await getEnrollments(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const enrollments = data?.data?.enrollments;
    const paginationData = data?.data?.pagination;

    if (enrollments?.length <= 0) {
        return <NotFoundComponent message={data?.message} title="Enrollment List" />;
    }

    const formatCurrency = (amount?: number | null) =>
        amount !== undefined && amount !== null
            ? `${Number(amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })} ৳`
            : "N/A";


    console.log(enrollments);
    return (
        <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-[50px]">Sl</TableHead>
                            <TableHead className="text-center min-w-[90px]">Action</TableHead>
                            <TableHead className="text-start min-w-[150px]">Student Details</TableHead>
                            <TableHead className="min-w-[150px]">Course & Batch</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center min-w-[120px]">Enrollment Date</TableHead>
                            <TableHead className="text-center min-w-[100px]">Status</TableHead>
                            <TableHead className="text-right min-w-[120px]">Pay Amount</TableHead>
                            <TableHead className="text-center min-w-[120px]">Payment Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {enrollments?.map((enrollment, i) => (
                            <TableRow key={enrollment?.id || i}>
                                <TableCell className="text-center">{(page - 1) * per_page + (i + 1)}</TableCell>
                                <TableCell className="text-center">
                                    {enrollment?.id && (
                                        <EnrollmentActionMenu
                                            enrollmentId={enrollment.id}
                                            currentStatus={enrollment.status}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-start">
                                    <p>{enrollment?.user?.name || "N/A"}</p>
                                    <p className="text-xs text-muted-foreground ">{enrollment?.user?.phone || "N/A"}</p>
                                    <p className="text-xs text-muted-foreground ">{enrollment?.user?.email || "N/A"}</p>
                                </TableCell>
                                
                                <TableCell>
                                    <p title={enrollment?.batch?.course?.title}>
                                        {enrollment?.batch?.course? truncate (enrollment?.batch?.course?.title) || "N/A" : "N/A"}
                                    </p>
                                    <p>{enrollment?.batch?.name || "N/A"} </p></TableCell>
                                <TableCell className="text-right">
                                    {enrollment?.discount_amount ? <del>{enrollment?.original_price ? formatCurrency(enrollment.original_price) : "N/A"}</del> : null} <br />
                                    <span className="font-semibold text-primary">{enrollment?.final_price ? formatCurrency(enrollment.final_price) : "N/A"}</span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs text-center">
                                    {enrollment?.enrollment_date ? new Date(enrollment.enrollment_date).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={enrollment?.status_label === "Active" ? "default" : "secondary"}
                                    >
                                        {enrollment?.status_label || "N/A"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-end">
                                    <span className="text-primary fw-bold">{enrollment?.payment_amount ? formatCurrency(enrollment.payment_amount) : ""}</span> <br />
                                    <span className="text-red-500">{enrollment?.due_amount ? "Due: " + formatCurrency(enrollment.due_amount) : ""}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={enrollment?.payment_status_label === "Paid" ? "default" : "secondary"}
                                    >
                                        {enrollment?.payment_status_label || "N/A"}
                                    </Badge>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div >
            { paginationData?.last_page > 1 &&  (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )
            }
        </>
    );
}
