import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import JobInfoCardBySlug from "@/components/root/jobCirculars/JobInfoCardBySlug";
import JobInfoRoleOverview from "@/components/root/jobCirculars/JobInfoRoleOverview";
import JobKeyResponsibilities from "@/components/root/jobCirculars/JobKeyResponsibilities";
import JobQualifications from "@/components/root/jobCirculars/JobQualifications";

interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}
const JobInfoBySlugWrapper = ({jobCirculars}: JobCircularParams) => {
    if (!jobCirculars) {
      return <div>
        <NotFoundComponent message="Job Circular Data Not Available Yet" />
      </div>;
    }
  return (
    <>
      <JobInfoCardBySlug jobCirculars={jobCirculars} />
      <JobInfoRoleOverview jobCirculars={jobCirculars} />
      <JobKeyResponsibilities jobCirculars={jobCirculars} />
      <JobQualifications jobCirculars={jobCirculars} />
    </>
  );
};

export default JobInfoBySlugWrapper;
