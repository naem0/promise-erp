import BrandsForm from "@/components/inventory/inventory-brands/BrandsForm";
import { getBrandById } from "@/apiServices/inventoryBrandsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch brand
    let brandRes;
    try {
        brandRes = await getBrandById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }
    if (!brandRes) {
        return null
    }
    if (!brandRes?.data) {
        return <NotFoundComponent message={brandRes?.message || "Brand not found."} />;
    }

    return (
        <BrandsForm
            title="Edit Brand"
            brand={brandRes?.data}
        />
    );
}
