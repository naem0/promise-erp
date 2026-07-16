import StockUpdateForm from "@/components/inventory/inventory-items/StockUpdateForm";
import { getRooms, Room } from "@/apiServices/inventoryRoomsService";
import { getProductItems, ProductItem } from "@/apiServices/inventoryItemsService";

export default async function StockUpdatePage() {
    let rooms: Room[] = [];
    let products: ProductItem[] = [];

    try {
        const roomRes = await getRooms({ per_page: 500 });
        rooms = roomRes?.data?.rooms || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
        if (error instanceof Error) {
            console.error("StockUpdatePage: failed to fetch rooms:", error.message);
        } else {
            console.error("StockUpdatePage: failed to fetch rooms:", error);
        }
    }
    

    try {
        const productRes = await getProductItems({ per_page: 500, status: "1" });
        products = productRes?.data?.products || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
        if (error instanceof Error) {
            console.error("StockUpdatePage: failed to fetch products:", error.message);
        } else {
            console.error("StockUpdatePage: failed to fetch products:", error);
        }   

    }

    return (
        <div className="mx-auto space-y-6">
            <StockUpdateForm
                rooms={rooms}
                products={products}
            />
        </div>
    );
}
