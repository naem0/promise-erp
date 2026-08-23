import AssignedForm from "@/components/inventory/item-users/AssignedForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import {
    getProductAssignmentById,
    ProductAssignment,
} from "@/apiServices/inventoryItemUsersService";

export default async function ItemUsersEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    let assignment: ProductAssignment | null = null;

    try {
        const res = await getProductAssignmentById(id);
        if (res?.data && !Array.isArray(res.data)) {
            assignment = res.data as ProductAssignment;
        }
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
        const message = error instanceof Error ? error.message : "Failed to fetch assigned item";
        return <ErrorComponent message={message} />;
    }

    if (!assignment) {
        return <ErrorComponent message="Assigned item not found." />;
    }

    if (assignment.group_item_id) {
        return (
            <ErrorComponent message="This item is part of an assigned group items and cannot be edited individually." />
        );
    }

    return (
        <AssignedForm
            title="Edit Assigned Item"
            assignment={assignment}
        />
    );
}
