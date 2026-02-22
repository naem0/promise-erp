import { getToolById, Tool } from "@/apiServices/toolsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import ToolsForm from "@/components/lms/tools/ToolsForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditToolPage({ params }: PageProps) {
  const { id } = await params;

  let response;
  try {
    response = await getToolById(Number(id));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!response?.data) {
    return <NotFoundComponent message={response.message || "No tool found."} />;
  }

  const tool: Tool = response?.data;

  return <ToolsForm title="Edit Tool" tool={tool} />;
}
