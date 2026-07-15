import RequisitionsForm from "@/components/inventory/requisitions/RequisitionsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import { getProductItems } from "@/apiServices/inventoryItemsService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/apiServices/auth/profileService";
import { getRooms } from "@/apiServices/inventoryRoomsService";

export default async function RequisitionsAddPage() {
  let currentUser = null;
  let products = [];
  let rooms = [];
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  try {
    if (!token) throw new Error("No valid session/token");
    const userRes = await getUserProfile(token);
    currentUser = userRes?.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error loading user profile: ${error.message}`} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while loading user profile." />
        </div>
      );
    }
  }

  try {
    const mainBranchId = currentUser?.main_branch?.id;
    const [productRes, roomRes] = await Promise.all([
      getProductItems({ per_page: 500 }),
      mainBranchId
        ? getRooms({ branch_id: mainBranchId, per_page: 500 }).catch((err) => {
            console.error("Error loading rooms in add page:", err);
            return null;
          })
        : Promise.resolve(null),
    ]);
    products = productRes?.data?.products || [];
    rooms = roomRes?.data?.rooms || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error loading form data: ${error.message}`} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while loading form data." />
        </div>
      );
    }
  }

  return (
    <RequisitionsForm
      title="Create Requisition"
      products={products}
      rooms={rooms}
      currentUser={currentUser}
    />
  );
}
