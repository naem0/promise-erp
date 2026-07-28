import {
  getPublicTeachersList,
  TeacherListApiResponse,
} from "@/apiServices/webPageTrainerService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import TrainerItemCard from "./TrainerItemCard";
interface TrainersParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const TrainerItemWrapper = async ({ searchParams }: TrainersParams) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 30,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };

  let teachers: TeacherListApiResponse | null = null;

  try {
    teachers = await getPublicTeachersList({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while fetching trainers." />
        </div>
      );
    }
  }

  const seniorTrainers = teachers?.data?.teachers || [];
  const totalPages = teachers?.data?.pagination || null;
  if (!teachers || !teachers?.data) {
    return null;
  }
  return (
    <section className="py-8 md:py-12">
      <h2 className="text-center text-2xl font-semibold mb-8 max-w-fit mx-auto border-b-2 border-primary pb-2">
        Expert Trainers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
        {seniorTrainers?.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-full">
            <NotFoundComponent
              message={teachers?.message || "No trainers found"}
            />
          </div>
        ) : (
          seniorTrainers?.map((trainer) => (
            <TrainerItemCard key={trainer?.id} trainer={trainer} />
          ))
        )}
      </div>
      {totalPages && totalPages.last_page > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination pagination={totalPages} />
        </div>
      )}
    </section>
  );
};

export default TrainerItemWrapper;
