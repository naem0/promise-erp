import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import GroupItemsFilter from "./GroupItemsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function GroupItemsFilterData() {
    let categories = [];

    try {
        const res = await getProductCategories({ per_page: 500 });
        categories = res?.data?.categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching categories for filter: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching categories for filter.`} />
                </div>
            );
        }
    }

    return (
        <GroupItemsFilter categories={categories} />
    );
}
