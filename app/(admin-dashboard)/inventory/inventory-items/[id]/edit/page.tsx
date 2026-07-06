import ItemsForm from "@/components/inventory/inventory-items/ItemsForm";
import { getProductItemById } from "@/apiServices/inventoryItemsService";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import { getUnits } from "@/apiServices/inventoryUnitsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch product item
    let itemRes;
    try {
        itemRes = await getProductItemById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!itemRes) {
        return null;
    }

    if (!itemRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message={itemRes?.message || "Item not found."} />
            </div>
        );
    }

    // Fetch dropdown data
    let categories;
    let categoryRes;
    let brands;
    let brandRes;
    let units;
    let unitsRes;

    try {
        categoryRes = await getProductCategories({ per_page: 500 });
        categories = categoryRes?.data?.categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        } else {
            console.error("Unknown error:", error);
        }
    }

    try {
        brandRes = await getBrands({ per_page: 500 });
        brands = brandRes?.data?.brands || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        } else {
            console.error("Unknown error:", error);
        }
    }

    try {
        unitsRes = await getUnits({ per_page: 500 });
        units = unitsRes?.data?.units || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
        } else {
            console.error("Unknown error:", error);
        }
    }

    if (!categoryRes || !categoryRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="Failed to fetch categories data." />
            </div>
        );
    }
    
    if (!brandRes || !brandRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="Failed to fetch brands data." />
            </div>
        );
    }

    if (!unitsRes || !unitsRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="Failed to fetch units data." />
            </div>
        );
    }

    return (
        <ItemsForm
            title="Edit Item"
            item={itemRes?.data}
            categories={categories}
            brands={brands}
            units={units}
        />
    );
}
