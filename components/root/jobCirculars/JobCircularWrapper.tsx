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
    console.log("====>>", jobCircularData)
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="mx-auto px-4 py-16 space-y-16">
          <ErrorComponent
            message={
              jobCircularData?.message || "Failed to fetch job circulars"
            }
          />
        </div>
      );
    } else {
      return (
        <div className="mx-auto px-4 py-16 space-y-16">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  if (!jobCircularData || !jobCircularData?.data) {
    return null;
  }

  const jobCirculars: JobCircularData | null = jobCircularData?.data || null;
  const paginationData: PaginationType | null =
    jobCircularData?.data?.pagination || null;
  const totalJobCirculars = jobCirculars?.careers || [];

  console.log("pagi",paginationData)

  return (
    <>
      <JobCircularSearch jobCirculars={jobCirculars} />
      <JobCircularsData totalJobCirculars={totalJobCirculars} />
      {paginationData?.per_page > 30 && (
        <div className="py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default JobCircularWrapper;
