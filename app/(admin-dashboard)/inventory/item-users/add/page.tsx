import AssignedForm from "@/components/inventory/item-users/AssignedForm";

export default async function ItemUsersAddPage({
    searchParams,
}: {
    searchParams: Promise<{ user_id?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const defaultUserId = resolvedSearchParams?.user_id || "";

    return (
        <AssignedForm
            title="Assign Items"
            defaultUserId={defaultUserId}
        />
    );
}
