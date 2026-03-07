import { JobCircularItem } from "@/apiServices/jobCircularPublicService";
import JobCircularCard from "./JobCircularCard";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface JobCircularsProps {
  totalJobCirculars: JobCircularItem[];
}

const JobCircularsData = ({ totalJobCirculars }: JobCircularsProps) => {
  return (
    <section className="py-8 md:py-12 ">
      <div className="container mx-auto px-4">
        <div className="">
          {totalJobCirculars.length > 0 ? (
            totalJobCirculars.map((job) => (
              <JobCircularCard key={job.id} job={job} />
            ))
          ) : (
            <div className="">
              <NotFoundComponent message={"Related Jobs Not Found"} />
              <div className="py-0 flex justify-center">
                <Button className="" asChild>
                  <Link href={`/job-circulars`} className="bg-primary px-4">
                    View All Jobs
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobCircularsData;
