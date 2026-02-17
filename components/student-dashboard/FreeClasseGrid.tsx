import { FreeClassesParams } from "@/app/student/freeseminar/page";
import EmptyCoursesState from "./EmptyCoursesState";
import FreeClasseCard from "./FreeClasseCard";
import { getFreeSeminars } from "@/apiServices/studentDashboardService";
import Pagination from "@/components/common/Pagination";

const FreeClasseGrid = async ({ searchParams }: FreeClassesParams) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ?? 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };

  const freeSeminars = await getFreeSeminars({ params });
  return (
    <>
      <div className="py-4 px-4">
        {freeSeminars?.data?.free_seminars.length === 0 ? (
          <EmptyCoursesState
            title="You haven’t Free Seminar yet."
            description="Discover Free Seminars that match your skills and interests."
            buttonText="Explore Free Seminars"
            buttonHref="#"
          />
        ) : (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
            {freeSeminars?.data?.free_seminars.map((course) => (
              <FreeClasseCard key={course.id} course={course} />
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
