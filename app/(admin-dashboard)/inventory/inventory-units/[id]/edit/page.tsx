import UnitsForm from "@/components/inventory/inventory-units/UnitsForm";
import { getUnitById } from "@/apiServices/inventoryUnitsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditUnitPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch unit
    let unitRes;
    try {
        unitRes = await getUnitById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!unitRes) {
        return null
    }

    if (!unitRes?.data) {
        return <NotFoundComponent message={unitRes?.message || "Unit not found."} />;
    }

    return (
        <UnitsForm
            title="Edit Unit"
            unit={unitRes?.data}
        />
    );
}
