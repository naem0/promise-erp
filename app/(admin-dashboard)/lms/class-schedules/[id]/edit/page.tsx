import SchedulesForm from "@/components/lms/class-schedules/SchedulesForm";
import { getClassScheduleById } from "@/apiServices/classSchedulesService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditClassSchedulePage({ params }: PageProps) {
    const { id } = await params;

    // Fetch class schedule details
    let scheduleRes;
    try {
        scheduleRes = await getClassScheduleById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!scheduleRes) {
        return null;
    }

    if (!scheduleRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message={scheduleRes?.message || "Class schedule not found."} />
            </div>
        );
    }

    return (
        <SchedulesForm
            title="Edit Class Schedule"
            schedule={scheduleRes?.data}
        />
    );
}
