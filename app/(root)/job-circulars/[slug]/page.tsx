import {
  getPublicJobCircular,
  getPublicJobCircularBySlug,
  JobCircularDetails,
} from "@/apiServices/jobCircularPublicService";
import ErrorComponent from "@/components/common/ErrorComponent";
import JobApplicationForm from "@/components/root/jobCirculars/JobApplicationForm";
import JobBySlugWrapperBanner from "@/components/root/jobCirculars/JobBySlugWrapperBanner";
import JobInfoBySlugWrapper from "@/components/root/jobCirculars/JobInfoBySlugWrapper";

interface JobCircularParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const response = await getPublicJobCircular( { per_page: 100 } );
  const jobItems = response?.data?.careers || [];
  if (!jobItems || jobItems.length === 0) {
    return [{ slug: "not-found" }];
  }

  return jobItems.map((job) => ({
    slug: job.slug,
  }));
}

const JobCircularBySlugdPage = async ({ params }: JobCircularParams) => {
  const { slug } = await params;
  let jobCircularData ;
  try {
    jobCircularData = await getPublicJobCircularBySlug(slug);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <ErrorComponent
          message={jobCircularData?.message || "Failed to fetch job circulars"}
        />
      );
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!jobCircularData || !jobCircularData?.data) {
    return null;
  }

  const jobCirculars: JobCircularDetails  = jobCircularData?.data || [];

  const careerId = jobCirculars?.id;

  return (
    <>
      <JobBySlugWrapperBanner />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="pb-10">
          <h1 className="text-center text-secondary capitalize font-bold text-2xl lg:text-4xl">
            Post For:- {jobCirculars?.title}
          </h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <JobInfoBySlugWrapper jobCirculars={jobCirculars} />
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <JobApplicationForm careerId={careerId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobCircularBySlugdPage;
