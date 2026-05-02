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
import Image from "next/image";
import { ConsultantPerformance, getConsultantPerformance } from "@/apiServices/crmConsultantPerformanceService";
import Pagination from "@/components/common/Pagination";

const ConsultantsPerformanceData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
    const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;
    
    const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
    const branch_id = typeof resolvedSearchParams.branch_id === "string" ? resolvedSearchParams.branch_id : undefined;
    const month = typeof resolvedSearchParams.month === "string" ? resolvedSearchParams.month : undefined;

    const params = {
        page,
        per_page,
        search,
        branch_id,
        month,
    };

    let results;
    try {
        results = await getConsultantPerformance(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const consultants = results?.data?.consultants || [];
    const paginationData = results?.data?.pagination;
    if (!results || !results?.success || !results?.data) {
        return  null
    }


    if (!consultants?.length) {
        return (
            <NotFoundComponent message={results?.message || "No consultant performance found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Image</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Designation</TableHead>
                            <TableHead className="text-center">Department</TableHead>
                            <TableHead className="text-center">Total Assigned</TableHead>
                            <TableHead className="text-center">Contacted</TableHead>
                            <TableHead className="text-center">Enrolled</TableHead>
                            <TableHead className="text-center">Lost</TableHead>
                            <TableHead className="text-center">Success Rate</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {consultants.map((consultant: ConsultantPerformance, index: number) => (
                            <TableRow key={consultant?.id}>
                                <TableCell className="text-center">
                                    {(page - 1) * per_page + (index + 1)}
                                </TableCell>
                                <TableCell className="font-medium flex items-center justify-center">
                                    <Image
                                        src={consultant?.profile_image || "/images/profile_avatar.png"}
                                        alt={consultant?.name || "Consultant"}
                                        width={40}
                                        height={40}
                                        className="object-cover rounded-full h-10 w-10"
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    {consultant?.name || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {consultant?.designation || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {consultant?.department || "—"}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {consultant?.total_lead_assign ?? 0}
                                </TableCell>
                                <TableCell className="text-center text-blue-600 font-medium">
                                    {consultant?.contacted ?? 0}
                                </TableCell>
                                <TableCell className="text-center text-green-600 font-medium">
                                    {consultant?.enrolled ?? 0}
                                </TableCell>
                                <TableCell className="text-center text-red-600 font-medium">
                                    {consultant?.lost ?? 0}
                                </TableCell>
                                <TableCell className="text-center font-semibold text-emerald-600">
                                    {consultant?.performance_rate || "0%"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
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

export default ConsultantsPerformanceData;
