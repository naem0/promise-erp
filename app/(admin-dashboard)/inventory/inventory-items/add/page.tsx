import ItemsForm from "@/components/inventory/inventory-items/ItemsForm";
import { getProductCategories, ProductCategoriesResponse } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import { getUnits } from "@/apiServices/inventoryUnitsService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ItemsAddPage() {
    let categories;
    let categoryRes: ProductCategoriesResponse | null = null;
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
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
        } else {
            console.error("Unknown error:", error);
        }
    }

    if (!categoryRes || !categoryRes?.data) {
        return null
    }
    if (!brandRes || !brandRes?.data) {
        return null
    }
    if (!unitsRes || !unitsRes?.data) {
        return null
    }

    return (
        <ItemsForm
            title="Add Product"
            categories={categories}
            brands={brands}
            units={units}
        />
    );
}