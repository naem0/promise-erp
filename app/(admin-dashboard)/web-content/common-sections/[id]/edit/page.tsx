import { getCommonSectionById, CommonSection } from "@/apiServices/homePageAdminService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import CommonSectionForm from "@/components/web-content/common-sections/CommonSectionsForm";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCommonSectionPage({ params }: PageProps) {
  const { id } = await params;

  let response;
  try {
    response = await getCommonSectionById(Number(id));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load common section.";
    return <ErrorComponent message={message} />;
  }

  if (!response?.success) {
    return (
      <ErrorComponent
        message={response?.message || "Failed to load common section."}
      />
    );
  }

  if (!response?.data) {
    return (
      <NotFoundComponent
        message={response?.message || "No common section found."}
      />
    );
  }

  const commonSection: CommonSection = response?.data;

  return (
    <div className="space-y-6 mx-auto">
      <CommonSectionForm title="Edit Common Section" commonSection={commonSection} />
    </div>
  );
}
