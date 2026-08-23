import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { getDydApplications } from "@/apiServices/dydApplicationService";
import DydApplicationsTable from "./DydApplicationsTable";

const DydApplicationsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const per_page =
    typeof resolvedSearchParams.per_page === "string"
      ? Number(resolvedSearchParams.per_page)
      : 15;
  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    apply_branch_id:
      typeof resolvedSearchParams.apply_branch_id === "string"
        ? resolvedSearchParams.apply_branch_id
        : typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    division_id:
      typeof resolvedSearchParams.division_id === "string"
        ? resolvedSearchParams.division_id
        : undefined,
    district_id:
      typeof resolvedSearchParams.district_id === "string"
        ? resolvedSearchParams.district_id
        : undefined,
    education:
      typeof resolvedSearchParams.education === "string"
        ? resolvedSearchParams.education
        : undefined,
    apply_status:
      typeof resolvedSearchParams.apply_status === "string"
        ? resolvedSearchParams.apply_status
        : typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    applied_batch:
      typeof resolvedSearchParams.applied_batch === "string"
        ? resolvedSearchParams.applied_batch
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
  };

  let results;
  try {
    results = await getDydApplications(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results?.data) {
    return null;
  }

  const applications = results?.data?.applications || [];
  const paginationData = results?.data?.pagination;

  if (!applications?.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No DYD applications found."}
        title="DYD Applications List"
      />
    );
  }

  return (
    <DydApplicationsTable
      applications={applications}
      paginationData={paginationData}
      page={page}
      per_page={per_page}
    />
  );
};

export default DydApplicationsData;
