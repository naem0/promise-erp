import { getBatchById, Batch } from "@/apiServices/batchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import BatchChapterLessonsForm from "@/components/lms/batches/BatchChapterLessonsForm";

type BatchChapterLessonsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BatchChapterLessonsPage({
    params,
}: BatchChapterLessonsPageProps) {
    const { id: batchId } = await params;

    let batch: Batch | null = null;
    let message: string | undefined;

    try {
        const res = await getBatchById(batchId);
        batch = res.data;
        message = res.message;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!batch) {
        return (
            <NotFoundComponent
                title="Batch"
                message={message || "Batch not found."}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Manage Chapters &amp; Lessons
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Batch:{" "}
                    <span className="font-medium text-foreground">{batch.name}</span>
                    {batch.course?.title && (
                        <>
                            {" - "}
                            <span className="font-medium text-foreground">
                                {batch.course.title}
                            </span>
                        </>
                    )}
                </p>
            </div>

            <BatchChapterLessonsForm
                batchId={batch.id}
                courseId={batch.course_id}
                batchName={batch.name}
            />
        </div>
    );
}
