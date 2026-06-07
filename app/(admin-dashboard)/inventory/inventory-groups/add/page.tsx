import GroupItemsForm from "@/components/inventory/inventory-groups/GroupItemsForm";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getProductItems } from "@/apiServices/inventoryItemsService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function GroupItemsAddPage() {
    let categories = [];
    let products = [];

    try {
        const categoriesRes = await getProductCategories({ per_page: 500 });
        categories = categoriesRes?.data?.categories || [];
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "An unknown error occurred.";
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching categories: ${errMsg}`} />
            </div>
        );
    }

    try {
        const productsRes = await getProductItems({ per_page: 500 });
        products = productsRes?.data?.products || [];
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "An unknown error occurred.";
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching products: ${errMsg}`} />
            </div>
        );
    }

    return (
        <GroupItemsForm
            title="Add Group Item"
            categories={categories}
            productsList={products}
        />
    );
}
