import EmployeesForm from "@/components/lms/employees/EmployeesForm";
import { getBranches } from "@/apiServices/branchService";
import { getGeneralRolesList, Role } from "@/apiServices/rolePermissionService";
import { getDepartments, getDesignations, getSalaryScales } from "@/apiServices/employeeService";
import { getTools } from "@/apiServices/toolsService";
import ErrorComponent from "@/components/common/ErrorComponent";


export default async function EmployeesAddPage() {
    let branches;
    let roles: Role[] = [];
    let departments;
    let designations;
    let salaryScales;
    let allTools;

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
    } catch (error: unknown) {
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
            } catch (error: unknown) {
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
    } catch (error: unknown) {
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

    try {
        const res = await getSalaryScales({ per_page: 500 });
        salaryScales = res?.data?.salary_scales || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching salary scales: ${error.message}`} />
            </div>);
        } else {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching salary scales.`} />
            </div>);
        }
    }

    try {
        const res = await getTools({ per_page: 500 });
        allTools = res?.data?.tools || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`Error fetching tools: ${error.message}`} />
            </div>);
        } else {
            return (<div className="py-8 md:py-12">
                <ErrorComponent message={`An unknown error occurred while fetching tools.`} />
            </div>);
        }
    }

    return (
        <EmployeesForm
            title="Add Employee"
            branches={branches}
            roles={roles}
            departments={departments}
            designations={designations}
            salaryScales={salaryScales}
            allTools={allTools}
        />
    );
}
