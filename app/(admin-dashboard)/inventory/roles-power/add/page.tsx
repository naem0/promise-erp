import RolesPowerForm from "@/components/inventory/roles-power/RolesPowerForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllRolesList, Role } from "@/apiServices/rolePermissionService";
import { getRequisitionFlows, RequisitionFlow } from "@/apiServices/inventoryRequisitionFlowsService";

export default async function RolesPowerAddPage() {
    let roles: Role[] = [];
    let flows: RequisitionFlow[] = [];
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        if (token) {
            const rolesRes = await getAllRolesList({ token, params: { per_page: 500 } });
            roles = rolesRes?.data?.roles || [];

            const flowsRes = await getRequisitionFlows({ per_page: 100 });
            flows = flowsRes?.data?.flows || [];
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
            title="Add Roles Power Step"
            roles={roles}
            flows={flows}
        />
    );
}
