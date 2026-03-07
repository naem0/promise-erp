import {
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

const JobCircularBySlugdPage = async ({ params }: JobCircularParams) => {
  const { slug } = await params;
  console.log(slug);
  let jobCircularData;
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

  const jobCirculars: JobCircularDetails = jobCircularData?.data || {};

  return (
    <>
      <JobBySlugWrapperBanner />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="pb-10">
          <h1 className="text-center text-secondary capitalize font-bold text-2xl lg:text-4xl">
            Post For:- {jobCirculars.title}
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
              <JobApplicationForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobCircularBySlugdPage;
