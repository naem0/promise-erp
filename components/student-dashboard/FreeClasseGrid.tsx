import { FreeClassesParams } from "@/app/student/freeseminar/page";
import EmptyCoursesState from "./EmptyCoursesState";
import FreeClasseCard from "./FreeClasseCard";
import { getFreeSeminars } from "@/apiServices/studentDashboardService";
import Pagination from "@/components/common/Pagination";
import ErrorComponent from "../common/ErrorComponent";

const FreeClasseGrid = async ({ searchParams }: FreeClassesParams) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ?? 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };

  let freeSeminars;

  try {
    freeSeminars = await getFreeSeminars({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={freeSeminars?.message || "Failed to fetch free seminars"}
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }
  if (!freeSeminars || !freeSeminars?.success || !freeSeminars?.data) {
    return null;
  }

  const free_seminars = freeSeminars?.data?.free_seminars || [];

  return (
    <>
      <div className="py-4 px-4">
        {free_seminars?.length === 0 ? (
          <EmptyCoursesState
            title="You haven’t Free Seminar yet."
            description="Discover Free Seminars that match your skills and interests."
            buttonText="Explore Free Seminars"
            buttonHref="#"
          />
        ) : (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
            {free_seminars?.map((course) => (
              <FreeClasseCard key={course?.id} course={course} />
            ))}
          </div>
        )}
      </div>
      {freeSeminars?.data?.pagination?.per_page > 16 && (
        <Pagination pagination={freeSeminars.data.pagination} />
      )}
    </>
  );
};

export default FreeClasseGrid;
