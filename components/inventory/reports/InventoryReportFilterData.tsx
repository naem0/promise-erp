import { ProductCategory, getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { Room, getRooms } from "@/apiServices/inventoryRoomsService";
import InventoryReportFilter from "./InventoryReportFilter";

export default async function InventoryReportFilterData() {
  let categories: ProductCategory[] = [];
  let rooms: Room[] = [];

  try {
    const categoryRes = await getProductCategories({ per_page: 500 });
    categories = categoryRes?.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories for inventory report:", error);
  }

  try {
    const roomRes = await getRooms({ per_page: 500 });
    rooms = roomRes?.data?.rooms || [];
  } catch (error) {
    console.error("Error fetching rooms for inventory report:", error);
  }

  return (
    <InventoryReportFilter categories={categories} rooms={rooms} />
  );
}
