// import { getMyCourseBySlug } from "@/apiServices/studentDashboardService";
import { getStudentMyCoursesBySlug } from "@/apiServices/studentDashboardService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import MyCourseBySlugCourseModule from "@/components/student-dashboard/MyCourseBySlugCourseModule";
import MyCourseBySlugHeader from "@/components/student-dashboard/MyCourseBySlugHeader";
import MyCourseBySlugNavigationBtn from "@/components/student-dashboard/MyCourseBySlugNavigationBtn";
import MyCourseBySlugVideoPlayer from "@/components/student-dashboard/MyCourseBySlugVideoPlayer";
import { WhatsAppCard } from "@/components/student-dashboard/WhatsAppCard";
import { Card, CardContent } from "../ui/card";
interface MyCoursesBySlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
const MyCourseBySlugWrapper = async ({
  params,
  searchParams,
}: MyCoursesBySlugPageProps) => {
  const { slug } = await params;
  const queryParams = await searchParams;

  const lessonId = queryParams?.lesson_id
    ? Number(queryParams.lesson_id)
    : undefined;
  const batchId = queryParams?.batch_id ? Number(queryParams.batch_id) : undefined;
  const queryParamsLessonId = {
    lesson_id: lessonId,
    batch_id: batchId,
  };

  const response = await getStudentMyCoursesBySlug(slug, queryParamsLessonId);

  if (!response.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorComponent message={response.message} />
      </div>
    );
  }
  if (!response.data) {
    return <NotFoundComponent message={response.message} />;
  }
  const courseTitle = response?.data?.course?.title;
  const currentLesson = response?.data?.current_lesson;
  const navigation = response?.data?.navigation;
  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-8">
      <div className="container mx-auto">
        <MyCourseBySlugHeader title={courseTitle} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 ">
            <Card>
              <CardContent>
                <MyCourseBySlugVideoPlayer currentLesson={currentLesson} />
                <MyCourseBySlugNavigationBtn navigation={navigation} />
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-4">
              <CardContent>
                <MyCourseBySlugCourseModule
                  slug={slug}
                  currentLessonId={lessonId}
                  batchId={batchId}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <WhatsAppCard groupLink="https://chat.whatsapp.com/example" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseBySlugWrapper;
