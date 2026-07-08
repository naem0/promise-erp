import { getDeliveryTypeById } from "@/apiServices/inventoryDeliveryTypesService";
import DeliveryTypesForm from "@/components/inventory/inventory-delivery-types/DeliveryTypesForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditDeliveryTypePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    let result;
    try {
        result = await getDeliveryTypeById(id);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    if (!result || !result?.data) {
        return (
            <NotFoundComponent
                message={result?.message || "Delivery type not found"}
            />
        );
    }

    const item = result?.data;

    return (
        <div className="space-y-6 mx-auto">
            <DeliveryTypesForm title="Edit Delivery Type" item={item} />
        </div>
    );
}
