import CategoriesForm from "@/components/inventory/inventory-categories/CategoriesForm";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CategoriesAddPage() {
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
            title="Add Category"
            categories={categories}
        />
    );
}
