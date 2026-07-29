import EmployeesForm from "@/components/lms/employees/EmployeesForm";
import { getEmployeeById, getSalaryScales } from "@/apiServices/employeeService";
import { getBranches } from "@/apiServices/branchService";
import { getTools } from "@/apiServices/toolsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({ params }: PageProps) {
    const { id } = await params;

    // Fetch employee
    let employeeRes;
    try {
        employeeRes = await getEmployeeById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!employeeRes?.data) {
        return <NotFoundComponent message={employeeRes?.message || "Employee not found."} />;
    }

    // Fetch related lists with individual try/catch
    let branches;
    let salaryScales;
    let allTools;

    try {
        const res = await getBranches({ per_page: 500 });
        branches = res?.data?.branches || [];
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "digest" in error) throw error;
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
            title="Edit Employee"
            employee={employeeRes.data}
            branches={branches}
            salaryScales={salaryScales}
            allTools={allTools}
        />
    );
}