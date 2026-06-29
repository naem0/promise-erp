import RequisitionsForm from "@/components/inventory/requisitions/RequisitionsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getRequisitionById } from "@/apiServices/requisitionsService";
import { getBranches } from "@/apiServices/branchService";
import { getProductItems } from "@/apiServices/inventoryItemsService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile, UserProfile } from "@/apiServices/auth/profileService";

interface RequisitionEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequisitionEditPage({
  params,
}: RequisitionEditPageProps) {
  const { id } = await params;

  let requisition = null;
  let branches = [];
  let products = [];
  let currentUser: UserProfile | undefined = undefined;

  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    const [requisitionRes, branchRes, productRes] = await Promise.all([
      getRequisitionById(Number(id)),
      getBranches({ per_page: 500 }),
      getProductItems({ per_page: 500 }),
    ]);
    requisition = requisitionRes?.data || null;
    branches = branchRes?.data?.branches || [];
    products = productRes?.data?.products || [];

    if (token) {
      const profileRes = await getUserProfile(token as string);
      if (profileRes?.data) {
        currentUser = profileRes.data;
      }
    }

    // Fallback to session name
    if (!currentUser && session?.user) {
      currentUser = {
        id: Number(session.user.id) || 0,
        uuid: "",
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        organization: {
          id: 0,
          name: "",
        },
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error loading data: ${error.message}`} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while loading data." />
        </div>
      );
    }
  }

  if (!requisition) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message="Requisition not found." />
      </div>
    );
  }

  return (
    <RequisitionsForm
      title="Edit Requisition"
      requisition={requisition}
      products={products}
      currentUser={currentUser}
    />
  );
}
