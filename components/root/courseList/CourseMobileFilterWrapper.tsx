import { ApiResponse, getPublicCoursesList } from "@/apiServices/courseListPublicService";
import CourseMobileFilterBar from "./CourseMobileFilterBar";

interface CoursesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CourseMobileFilterWrapper = async ({ searchParams }: CoursesPageProps) => {
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
  } catch {
    return null;
  }

  if (!response || !response.success || !response?.data) {
    return null;
  }

  return <CourseMobileFilterBar filters={response?.data?.filters} />;
};

export default CourseMobileFilterWrapper;
