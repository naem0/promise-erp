import CourseDetailsWrapper from "@/components/root/courseDetail/CourseDetailsWrapper";
import { getPublicCoursesList } from "@/apiServices/courseListPublicService";
import {
  ApiResponse,
  getCourseDetailBySlug,
} from "@/apiServices/courseDetailPublicService";
import { Suspense } from "react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const response = await getPublicCoursesList({ params: { per_page: 100 } });
  const courses = response?.data?.courses;
  if (!courses || courses.length === 0) {
    return [{ slug: "not-found" }];
  }

  return courses.map((course) => ({
    slug: course.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { slug } = await params;

  try {
    const response: ApiResponse | null = await getCourseDetailBySlug(slug);

    if (!response || !response.success || !response?.data) {
      return null;
    }

    const course = response.data;

    return {
      title: course.title,
      description: course.description,
      openGraph: {
        title: course.title,
        description: course.description,
        images: course.featured_image ? [{ url: course.featured_image }] : [],
      },
    };
  } catch (error) {
    console.error("Error loading course:", error);
    return {
      title: "Course Not Found",
      description: "The course does not exist.",
    };
  }
}

// Course Detail Page Component
const CourseDetail = async ({ params }: CourseDetailPageProps) => {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <h1 className="text-2xl text-center">Loading...</h1>
      </div>
    </div>}>
      <CourseDetailsWrapper slug={slug} />
    </Suspense>
  );
};

export default CourseDetail;
