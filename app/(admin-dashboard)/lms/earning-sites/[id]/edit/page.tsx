import EarningSiteForm from "@/components/lms/earning-sites/EarningSiteForm";
import { getEarningSiteById } from "@/apiServices/earningSiteService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEarningSitePage({ params }: PageProps) {
    const { id } = await params;

    let res;
    try {
        res = await getEarningSiteById(id);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!res) {
        return null;
    }
    if (!res?.data) {
        return <NotFoundComponent message={res?.message || "Earning site not found."} title="Edit Earning Site" />;
    }

    return (
        <EarningSiteForm
            title="Edit Earning Site"
            earningSite={res.data}
        />
    );
}
