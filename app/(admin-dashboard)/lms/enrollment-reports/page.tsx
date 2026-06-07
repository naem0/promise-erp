import EnrollmentReportsSummaryWrapper from "@/components/lms/enrollment-reports/EnrollmentReportsSummaryWrapper";
import EnrollmentReportsFilterData from "@/components/lms/enrollment-reports/EnrollmentReportsFilterData";
import EnrollmentReportsData from "@/components/lms/enrollment-reports/EnrollmentReportsData";
import { Suspense } from "react";

export default async function EnrollmentReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-secondary">Enrollment Reports</h1>
            </div>

            <Suspense fallback={<h2 className="text-2xl font-semibold tracking-tight text-secondary text-center">Loading summary...</h2>}>
                <EnrollmentReportsSummaryWrapper />
            </Suspense>

            <Suspense fallback={<h2 className="text-2xl font-semibold tracking-tight text-secondary text-center">Loading filters...</h2>}>
                <EnrollmentReportsFilterData />
            </Suspense>

            <Suspense fallback={<h2 className="text-2xl font-semibold tracking-tight text-secondary text-center">Loading report data...</h2>}>
                <EnrollmentReportsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
