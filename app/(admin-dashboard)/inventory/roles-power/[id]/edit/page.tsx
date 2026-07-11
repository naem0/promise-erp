import RolesPowerForm from "@/components/inventory/roles-power/RolesPowerForm";
import { getRolesPowerStepById, RolesPowerStep } from "@/apiServices/inventoryRolesPowerService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllRolesList, Role } from "@/apiServices/rolePermissionService";
import { getRequisitionFlows, RequisitionFlow } from "@/apiServices/inventoryRequisitionFlowsService";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RolesPowerEditPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    let step: RolesPowerStep | null = null;
    try {
        const res = await getRolesPowerStepById(Number(id));
        step = res?.data || null;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!step) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message="Roles power step not found." />
            </div>
        );
    }

    // Fetch all roles & requisition flows for dropdowns
    let roles: Role[] = [];
    let flows: RequisitionFlow[] = [];
    try {
        if (token) {
            const rolesRes = await getAllRolesList({ token, params: { per_page: 500 } });
            roles = rolesRes?.data?.roles || [];

        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching data: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message="An unknown error occurred while fetching roles." />
                </div>
            );
        }
    }
    try {
        const flowsRes = await getRequisitionFlows({ per_page: 100 });
        flows = flowsRes?.data?.flows || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching data: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message="An unknown error occurred while fetching flows." />
                </div>
            );
        }
    }

    return (
        <RolesPowerForm
            title="Edit Roles Power Step"
            step={step}
            roles={roles}
            flows={flows}
        />
    );
}
