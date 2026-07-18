import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import { getRooms } from "@/apiServices/inventoryRoomsService";
import ItemsFilter from "./ItemsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ItemsFilterData() {
    let categories;
    let categoryRes;
    let brands;
    let brandRes;
    let rooms;
    let roomRes;

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
        roomRes = await getRooms({ per_page: 500 });
        rooms = roomRes?.data?.rooms || [];
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'digest' in error) throw error;
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

    if (!roomRes || !roomRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <ErrorComponent message="Failed to fetch rooms data." />
            </div>
        );
    }

    return (
        <ItemsFilter categories={categories} brands={brands} rooms={rooms} />
    );
}
