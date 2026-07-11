import { getDepartmentById } from "@/apiServices/departmentService";
import DepartmentsForm from "@/components/lms/departments/DepartmentsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  let result;
  try {
    result = await getDepartmentById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!result || !result.data) {
    return (
      <NotFoundComponent
        message={result?.message || "Department not found"}
      />
    );
  }

  const item = result?.data;

  return (
      <div className="space-y-6 mx-auto">
        <DepartmentsForm title="Edit Department" item={item} />
      </div>
  );
}
