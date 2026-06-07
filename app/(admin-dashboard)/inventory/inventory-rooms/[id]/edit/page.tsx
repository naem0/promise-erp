import RoomsForm from "@/components/inventory/inventory-rooms/RoomsForm";
import { getRoomById } from "@/apiServices/inventoryRoomsService";
import { getBranches } from "@/apiServices/branchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch room details
    let roomRes;
    try {
        roomRes = await getRoomById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!roomRes) {
        return null;
    }

    if (!roomRes?.data) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message={roomRes?.message || "Room not found."} />
            </div>
        );
    }

    // Fetch all branches
    let branches = [];
    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching branches: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
                </div>
            );
        }
    }

    return (
        <RoomsForm
            title="Edit Room"
            room={roomRes?.data}
            branches={branches}
        />
    );
}
