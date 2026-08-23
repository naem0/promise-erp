import DydQuestionCategoryForm from "@/components/lms/dyd/question-categories/DydQuestionCategoryForm";
import { getDydQuestionCategoryById } from "@/apiServices/dydQuestionCategoryService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDydQuestionCategoryPage({ params }: PageProps) {
  const { id } = await params;

  let res;
  try {
    res = await getDydQuestionCategoryById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!res?.data) {
    return <NotFoundComponent message={res?.message || "Question category not found."} />;
  }

  return (
    <DydQuestionCategoryForm
      title="Edit Question Category"
      item={res?.data}
    />
  );
}
