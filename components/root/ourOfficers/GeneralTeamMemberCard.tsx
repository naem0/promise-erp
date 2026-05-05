import {
  AllOfficeDepartment,
  AllOfficeEmployeesApiResponse,
  getPublicAllEmployees,
} from "@/apiServices/employeeService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import GeneralTeamMemberInfos from "./GeneralTeamMemberInfos";

const GeneralTeamMemberCard = async () => {
  let employeeData: AllOfficeEmployeesApiResponse | null = null;

  try {
    employeeData = await getPublicAllEmployees();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 md:py-14">
        <ErrorComponent message="An unknown error occurred while fetching employees." />
      </div>
    );
  }

  const departments: AllOfficeDepartment[] = employeeData?.data || [];

  if (!employeeData || !employeeData?.success) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-14 space-y-12">
      {departments?.length > 0 ? (
        departments?.map((department) => (
          <div key={department?.department_id ?? "unknown"}>
            <h2 className="text-2xl md:text-4xl text-center mx-auto border-b-2 font-bold text-secondary max-w-fit mb-10 pb-2">
              {department?.department_name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center items-center">
              {department?.employees?.map((employee) => (
                <GeneralTeamMemberInfos
                  key={employee?.id}
                  employee={employee}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2">
          <NotFoundComponent
            message={employeeData?.message || "No employees found"}
          />
        </div>
      )}
    </div>
  );
};

export default GeneralTeamMemberCard;
