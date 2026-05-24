import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import ItemsFilter from "./ItemsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ItemsFilterData() {
    let categories;
    let categoryRes;
    let brands;
    let brandRes;

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

    return (
        <ItemsFilter categories={categories} brands={brands} />
    );
}
