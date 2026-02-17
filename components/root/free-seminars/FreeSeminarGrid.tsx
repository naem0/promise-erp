import { getFreeSeminarByPublicPage } from "@/apiServices/studentDashboardService";
import ErrorComponent from "@/components/common/ErrorComponent";
import Pagination from "@/components/common/Pagination";
import EmptyCoursesState from "@/components/student-dashboard/EmptyCoursesState";
import FreeClasseCard from "@/components/student-dashboard/FreeClasseCard";

interface FreeSeminarsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FreeSeminarGrid = async ({ searchParams }: FreeSeminarsPageProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ?? 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let freeSeminars;
  try {
    freeSeminars = await getFreeSeminarByPublicPage({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  return (
    <>
      <div className="py-4">
        {!freeSeminars?.data?.free_seminars?.length ? (
          <EmptyCoursesState
            title="You haven’t Free Seminar yet."
            description="Discover Free Seminars that match your skills and interests."
            buttonText="Explore Free Seminars"
            buttonHref="#"
          />
        ) : (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
            {freeSeminars?.data?.free_seminars?.map((course) => (
              <FreeClasseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      {freeSeminars?.data?.pagination && freeSeminars.data.pagination.total > freeSeminars.data.pagination.per_page && (
        <Pagination pagination={freeSeminars.data.pagination} />
      )}
    </>
  );
};

export default FreeSeminarGrid;
