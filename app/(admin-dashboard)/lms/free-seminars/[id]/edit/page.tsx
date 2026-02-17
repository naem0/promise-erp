import { getFreeSeminarById } from "@/apiServices/freeSeminarsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import FreeSeminarForm from "@/components/lms/free-seminars/FreeSeminarsForm";

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function EditFreeSeminarPage({ params }: PageProps) {
  try {
    const { id } = await params;

    const response = await getFreeSeminarById(id);

    if (!response.success) {
      return (
        <ErrorComponent
          message={response.message || "Failed to load free seminar."}
        />
      );
    }

    if (!response?.data) {
      return (
        <NotFoundComponent
          message={response.message || "No free seminar found."}
        />
      );
    }

    const freeSeminar = response?.data;

    return (
      <FreeSeminarForm title="Edit Free Seminar" freeSeminar={freeSeminar} />
    );
  } catch (error) {
    console.error("Error in EditFreeSeminarPage:", error);
    return (
      <ErrorComponent
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while loading the free seminar."
        }
      />
    );
  }
}
