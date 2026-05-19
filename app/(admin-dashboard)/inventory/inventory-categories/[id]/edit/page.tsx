import CategoriesForm from "@/components/inventory/inventory-categories/CategoriesForm";
import { getProductCategoryById, getProductCategories } from "@/apiServices/inventoryCategoriesService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch category
    let categoryRes;
    try {
        categoryRes = await getProductCategoryById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!categoryRes) {
        return null
    }

    if (!categoryRes?.data) {
        return <div className="py-8 md:py-12">
            <NotFoundComponent message={categoryRes?.message || "Category not found."} />
        </div>;
    }

    // Fetch all categories for parent dropdown
    let categories = [];
    try {
        const res = await getProductCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching categories: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching categories.`} />
                </div>
            );
        }
    }

    return (
        <CategoriesForm
            title="Edit Category"
            category={categoryRes?.data}
            categories={categories}
        />
    );
}
