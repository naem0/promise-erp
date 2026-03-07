import JobCircularJoinUs from "@/components/root/jobCirculars/JobCircularJoinUs";
import JobCircularWrapper from "@/components/root/jobCirculars/JobCircularWrapper";
import JobWrapperHeroBanner from "@/components/root/jobCirculars/JobWrapperHeroBanner";
interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const JobCircularsPage = ({ searchParams }: SearchParamsProps) => {
  return (
    <>
      <JobWrapperHeroBanner />
      <JobCircularWrapper searchParams={searchParams} />
      <JobCircularJoinUs />
    </>
  );
};

export default JobCircularsPage;
