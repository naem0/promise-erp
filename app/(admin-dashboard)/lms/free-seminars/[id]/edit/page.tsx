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
  // await params কে try-এর বাইরে রাখা হয়েছে যাতে Next.js dynamic signal সঠিকভাবে প্রপাগেট হয়
  const { id } = await params;

  try {
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
    if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
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
