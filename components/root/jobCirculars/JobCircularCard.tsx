import { Briefcase, MapPin, Calendar, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JobCircularItem } from "@/apiServices/jobCircularPublicService";

export interface JobCircularsProps {
  job: JobCircularItem;
}

const JobCircularCard = ({ job }: JobCircularsProps) => {

  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200 mb-4 last:mb-0">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-primary/20 border border-white shadow rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="border border-secondary text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                  {job.job_type_label}
                </span>
                <span className="border border-primary text-primary bg-primary/5 px-3 py-1 rounded-full">
                  {job.career_category.name}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-1">
                {job.title}
              </h3>
              <p className="text-secondary/80 mb-3">{job.subtitle}</p>

              <p className="text-primary font-semibold mb-2">
                Salary: {job.salary || "Negotiable"}
              </p>

              {/* Location & Deadline */}
              <div className="flex flex-wrap items-center gap-4 text-secondary">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{job.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Deadline: {job.deadline || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="shrink-0 self-end">
          <Button asChild className="cursor-pointer flex items-center gap-2">
            <Link
              href={`/job-circulars/${job.slug}`}
              target="_blank"
              className="bg-primary px-4"
            >
              Apply Now
              <MoveRight className="w-5 h-5 animate-bounce" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCircularCard;
