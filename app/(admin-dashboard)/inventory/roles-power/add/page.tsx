import RolesPowerForm from "@/components/inventory/roles-power/RolesPowerForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllRolesList, Role } from "@/apiServices/rolePermissionService";

export default async function RolesPowerAddPage() {
    let roles: Role[] = [];
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {

        if (token) {
            const res = await getAllRolesList({ token, params: { per_page: 500 } });
            roles = res?.data?.roles || [];
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching roles: ${error.message}`} />
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

    return (
        <RolesPowerForm
            title="Add Roles Power Step"
            roles={roles}
        />
    );
}
