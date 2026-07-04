import ItemsForm from "@/components/inventory/inventory-items/ItemsForm";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import { getUnits } from "@/apiServices/inventoryUnitsService";


export default async function ItemsAddPage() {
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
        if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
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
        if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
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
        if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
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
            title="Add Item"
            categories={categories}
            brands={brands}
            units={units}
        />
    );
}