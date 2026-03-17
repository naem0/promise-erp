import ReviewsForm from "@/components/lms/reviews/ReviewsForm";
import { getReviewById } from "@/apiServices/reviewService";
import { getBatches } from "@/apiServices/batchService";
import { getStudents } from "@/apiServices/studentService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: PageProps) {
    const { id } = await params;

    let reviewRes;
    try {
        reviewRes = await getReviewById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!reviewRes?.data) {
        return (
            <NotFoundComponent
                message={reviewRes?.message || "Review not found."}
            />
        );
    }

    let batches;
    let students;

    try {
        const batchesRes = await getBatches({ per_page: 500 });
        batches = batchesRes?.data?.batches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    try {
        const studentsRes = await getStudents({ per_page: 500 });
        students = studentsRes?.data?.students || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    return (
        <ReviewsForm
            title="Edit Review"
            review={reviewRes.data}
            batches={batches}
            students={students}
        />
    );
}