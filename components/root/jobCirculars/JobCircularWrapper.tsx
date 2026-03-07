import {
  getPublicJobCircular,
  JobCircularData,
} from "@/apiServices/jobCircularPublicService";
import ErrorComponent from "@/components/common/ErrorComponent";
import Pagination from "@/components/common/Pagination";
import JobCircularsData from "@/components/root/jobCirculars/JobCircularsData";
import { PaginationType } from "@/types/pagination";
import JobCircularSearch from "./JobCircularSearch";
interface SearchParamsProps {
  searchParams: Promise<{
    per_page?: string;
    page?: string;
    search?: string;
  }>;
}
const JobCircularWrapper = async ({ searchParams }: SearchParamsProps) => {
  const queryParams = await searchParams;
  let jobCircularData;
  const params = {
    per_page: parseInt(queryParams?.per_page ?? "30", 10),
    page: parseInt(queryParams?.page ?? "1", 10),
    search: queryParams?.search?.trim() || undefined,
  };

  try {
    jobCircularData = await getPublicJobCircular(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <ErrorComponent
          message={jobCircularData?.message || "Failed to fetch job circulars"}
        />
      );
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const jobCirculars: JobCircularData = jobCircularData?.data || {};
  const paginationData: PaginationType =
    jobCircularData?.data?.pagination || {};
  const totalJobCirculars = jobCirculars?.careers || [];

  return (
    <>
      <JobCircularSearch jobCirculars={jobCirculars} />
      <JobCircularsData totalJobCirculars={totalJobCirculars} />
      {paginationData.per_page >30 &&  (
        <div className="py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default JobCircularWrapper;
