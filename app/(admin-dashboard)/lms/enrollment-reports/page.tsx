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
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Enrollment Reports</h1>
            </div>

            <Suspense fallback={<div>Loading summary...</div>}>
                <EnrollmentReportsSummaryWrapper />
            </Suspense>

            <Suspense fallback={<div>Loading filters...</div>}>
                <EnrollmentReportsFilterData />
            </Suspense>

            <Suspense fallback={<div>Loading report data...</div>}>
                <EnrollmentReportsData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
