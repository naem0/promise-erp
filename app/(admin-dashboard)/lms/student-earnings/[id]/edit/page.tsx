import StudentEarningsForm from "@/components/lms/student-earnings/StudentEarningsForm";
import { getStudentEarningById } from "@/apiServices/studentEarningsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditStudentEarningPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch student earning
    let earningRes;
    try {
        earningRes = await getStudentEarningById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }
    if (!earningRes) {
        return null;
    }
    if (!earningRes?.data) {
        return <NotFoundComponent message={earningRes?.message || "Student earning not found."} />;
    }

    return (
        <StudentEarningsForm
            title="Edit Student Earning"
            earning={earningRes?.data}
        />
    );
}
