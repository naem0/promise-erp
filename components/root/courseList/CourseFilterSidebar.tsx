import { Card } from "@/components/ui/card";
import CourseFilterSection from "./CourseFilterSection";
import ErrorComponent from "@/components/common/ErrorComponent";
import { ApiResponse, getPublicCoursesList } from "@/apiServices/courseListPublicService";
interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const CourseFilterSidebar = async ({ searchParams }: CoursesPageProps) => {
  const resolvedParams = await searchParams;

  const params = {
    category_id: resolvedParams.category_id?.toString(),
    branch_id: resolvedParams.branch_id?.toString(),
    search: resolvedParams.search?.toString(),
    level: resolvedParams.level?.toString(),
    course_type: resolvedParams.course_type?.toString(),
    delivery_mode: resolvedParams.delivery_mode?.toString(),
    batch_status: resolvedParams.batch_status?.toString(),
    min_price: resolvedParams.min_price
      ? parseFloat(resolvedParams.min_price.toString())
      : undefined,
    max_price: resolvedParams.max_price
      ? parseFloat(resolvedParams.max_price.toString())
      : undefined,
    course_track: resolvedParams.course_track?.toString(),
    sort_order: resolvedParams.sort_order?.toString(),
    budget_scale: resolvedParams.budget_scale?.toString(),
    page: resolvedParams.page?.toString(),
  };

  let response: ApiResponse | null = null;
  try {
    response = await getPublicCoursesList(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }
  if (!response || !response.success || !response.data) {
    return null;
  }

  return (
    <Card className="p-6 top-4">
      <CourseFilterSection filters={response?.data?.filters} />
    </Card>
  );
};

export default CourseFilterSidebar;
