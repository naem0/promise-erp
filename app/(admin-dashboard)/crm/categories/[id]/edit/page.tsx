import { getCRMCategoryById } from "@/apiServices/crmCategoryService";
import CategoriesForm from "@/components/crm/categories/CategoriesForm";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const response = await getCRMCategoryById(Number(id));
    
    if (!response.success || !response.data) {
      return <ErrorComponent message={response.message || "Category not found"} />;
    }

    return (
      <div className="mx-auto">
        <CategoriesForm title="Edit CRM Category" category={response.data} />
      </div>
    );
  } catch (error: unknown) {
    return <ErrorComponent message={error instanceof Error ? error.message : "Failed to load category"} />;
  }
}
