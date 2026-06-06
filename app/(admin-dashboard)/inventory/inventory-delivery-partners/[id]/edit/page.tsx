import DeliveryPartnersForm from "@/components/inventory/inventory-delivery-partners/DeliveryPartnersForm";
import { getDeliveryPartnerById } from "@/apiServices/inventoryDeliveryPartnersService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDeliveryPartnerPage({ params }: PageProps) {
    const { id } = await params;

    let partnerRes;
    try {
        partnerRes = await getDeliveryPartnerById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!partnerRes) {
        return null;
    }

    if (!partnerRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message={partnerRes?.message || "Delivery partner not found."} />
            </div>
        );
    }

    return (
        <DeliveryPartnersForm
            title="Edit Delivery Partner"
            partner={partnerRes.data}
        />
    );
}
