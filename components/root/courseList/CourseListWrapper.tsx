import { ApiResponse, getPublicCoursesList } from "@/apiServices/courseListPublicService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import CourseCard from "@/components/root/courseList/CourseCard";
interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const CourseListWrapper = async ({ searchParams }: CoursesPageProps) => {
  const resolvedParams = await searchParams;
  const branchId = resolvedParams?.branch_id?.toString();


  const params = {
    category_id: resolvedParams.category_id?.toString(),
    branch_id: branchId,
    search: resolvedParams.search?.toString(),
    level: resolvedParams.level?.toString(),
    course_type: resolvedParams.course_type?.toString(),
    is_collaboration: resolvedParams.is_collaboration?.toString(),
    delivery_mode: resolvedParams.delivery_mode?.toString(),
    batch_status: resolvedParams.batch_status?.toString(),
    min_price: resolvedParams.min_price
      ? parseFloat(resolvedParams.min_price.toString())
      : undefined,
    max_price: resolvedParams.max_price
      ? parseFloat(resolvedParams.max_price.toString())
      : undefined,
    sort_order: resolvedParams.sort_order?.toString(),
    budget_scale: resolvedParams.budget_scale?.toString(),
    course_track: resolvedParams.course_track?.toString(),
    page: resolvedParams.page?.toString(),
    per_page: resolvedParams.per_page?.toString(),
  };

  let results: ApiResponse | null = null;

  try {
    results = await getPublicCoursesList(params);
  } catch (error) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />;
        </div>
      );
    }
  }

  if (!results || !results?.success || !results?.data) {
    return null;
  }

  const courses = results?.data?.courses || [];

  if (!courses?.length) {
    return <NotFoundComponent message={results?.message || "No courses found"} title="Course List" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 xl:gap-3">
        {courses?.map((course) => (
          <CourseCard key={course?.id} course={course} branchId={branchId} />
        ))}
      </div>
      {courses?.length > 0 && (
        <div className="pt-6">
          <Pagination pagination={results?.data?.pagination} />
        </div>
      )}
    </>
  );
};

export default CourseListWrapper;
