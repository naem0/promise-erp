import { getLicenseById } from "@/apiServices/licensesService";
import LicensesForm from "@/components/web-content/about-page/licenses/LicensesForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import PermissionGuard from "@/components/auth/PermissionGuard";


export default async function EditLicensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  let result;
  try {
    result = await getLicenseById(id);
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
        message={result?.message || "License entry not found"}
      />
    );
  }

  const item = result?.data;

  return (
      <div className="space-y-6 mx-auto">
        <LicensesForm title="Edit License" item={item} />
      </div>
  );
}
