import { getBranches } from "@/apiServices/branchService";
import { getGeneralRolesList, Role } from "@/apiServices/rolePermissionService";
import { getDepartments, getDesignations } from "@/apiServices/employeeService";
import EmployeesFilter from "./EmployeesFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function EmployeesFilterData() {

    let branches;
    let roles: Role[] = [];
    let departments;
    let designations;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching branches: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
          </div>);
      }
    }

    try {
        const res = await getGeneralRolesList({ params: { per_page: 500 } });
        roles = res?.data?.roles || [];
    } catch (error) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching roles: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching roles.`} />
          </div>);
        }
    }

    try {
        const res = await getDepartments({ per_page: 500 });
        departments = res?.data?.departments || [];
    } catch (error) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching departments: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching departments.`} />
          </div>);
        }
    }

    try {
        const res = await getDesignations({ per_page: 500 });
        designations = res?.data?.designations || [];
    } catch (error) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching designations: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching designations.`} />
          </div>);
        }
    }

    return (
        <EmployeesFilter
            branches={branches}
            roles={roles}
            departments={departments}
            designations={designations}
        />
    );
}