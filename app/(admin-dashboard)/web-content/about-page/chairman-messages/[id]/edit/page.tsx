import { getChairmanMessageById } from "@/apiServices/chairmanMessagesService";
import ChairmanMessagesForm from "@/components/web-content/about-page/chairman-messages/ChairmanMessagesForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditChairmanMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  let result;
  try {
    result = await getChairmanMessageById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!result || !result.data) {
    return (
      <NotFoundComponent
        message={result?.message || "Chairman message not found"}
      />
    );
  }

  const item = result?.data;

  return (
      <div className="space-y-6 mx-auto">
        <ChairmanMessagesForm title="Edit Management Message" item={item} />
      </div>
  );
}
