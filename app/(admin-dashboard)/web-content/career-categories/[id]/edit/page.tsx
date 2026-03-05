import CareerCategoriesForm from "@/components/web-content/career-categories/CareerCategoriesForm";
import { getCareerCategoryById } from "@/apiServices/careerCategoryService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function EditCareerCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let careerCategoryRes;

  try {
    careerCategoryRes = await getCareerCategoryById(id);
  } catch (error: unknown) {
    console.error("Error fetching career category:", error);
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return (
      <ErrorComponent message="An unexpected error occurred for career category" />
    );
  }

  const careerCategory = careerCategoryRes?.data;
  return (
    <CareerCategoriesForm
      title="Edit Career Category"
      careerCategory={careerCategory ?? undefined}
    />
  );
}
