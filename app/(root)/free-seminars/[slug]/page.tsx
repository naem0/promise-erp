import FreeSeminarDetailsWrapper from "@/components/root/free-seminars/FreeSeminarDetailsWrapper";
import {
  getFreeSeminarByPublicPage,
  PublicFreeSeminarBySlugResponse,
} from "@/apiServices/studentDashboardService";
import { getPublicFreeSeminarBySlug } from "@/apiServices/studentDashboardService";
import { Suspense } from "react";

interface FreeSeminarDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const response = await getFreeSeminarByPublicPage({
    params: { per_page: 100 },
  });
  const seminars = response?.data?.free_seminars;
  if (!seminars || seminars.length === 0) {
    return [{ slug: "not-found" }];
  }

  return seminars.map((seminar) => ({
    slug: seminar.slug,
  }));
}

export async function generateMetadata({
  params,
}: FreeSeminarDetailsPageProps) {
  const { slug } = await params;

  try {
    const response: PublicFreeSeminarBySlugResponse | null =
      await getPublicFreeSeminarBySlug(slug);

    if (!response || !response?.success || !response?.data) {
      return null;
    }

    const seminar = response?.data;

    return {
      title: seminar?.title,
      description: seminar?.description,
      openGraph: {
        title: seminar?.title,
        description: seminar?.description,
        images: seminar?.image ? [{ url: seminar?.image }] : [],
      },
    };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error)
      throw error;
    if (error instanceof Error) {
      console.error("Error fetching seminar:", error.message);
    } else {
      console.error("Error fetching seminar:", error);
    }
    console.error("Error loading seminar:", error);
  }
}

// Free Seminar Detail Page Component
const FreeSeminarDetail = async ({ params }: FreeSeminarDetailsPageProps) => {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16 space-y-16">
            <h1 className="text-2xl text-center">Loading...</h1>
          </div>
        </div>
      }
    >
      <FreeSeminarDetailsWrapper slug={slug} />
    </Suspense>
  );
};

export default FreeSeminarDetail;
