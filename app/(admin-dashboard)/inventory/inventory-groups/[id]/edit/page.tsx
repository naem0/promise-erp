import GroupItemsForm from "@/components/inventory/inventory-groups/GroupItemsForm";
import { getGroupItemById } from "@/apiServices/inventoryGroupItemsService";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getProductItems } from "@/apiServices/inventoryItemsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditGroupItemPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch group item
    let groupItemRes;
    try {
        groupItemRes = await getGroupItemById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!groupItemRes) {
        return null;
    }

    if (!groupItemRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message={groupItemRes?.message || "Group item not found."} />
            </div>
        );
    }

    // Fetch categories and products for dropdowns
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
            title="Edit Group Item"
            item={groupItemRes?.data}
            categories={categories}
            productsList={products}
        />
    );
}
