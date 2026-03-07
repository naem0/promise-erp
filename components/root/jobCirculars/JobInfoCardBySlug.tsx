
import { BookOpen, Headset, Banknote, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { JobCircularDetails } from "@/apiServices/jobCircularPublicService";

interface EmployeeCategory {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface JobCircularParams {
  jobCirculars: JobCircularDetails;
}

const JobInfoCardBySlug = ({ jobCirculars }: JobCircularParams) => {
  // Build dynamic categories from API response
  const categories: EmployeeCategory[] = [
    {
      title: "Salary",
      value: jobCirculars.salary || "Negotiable",
      icon: <Banknote className="w-8 h-8" />,
    },
    {
      title: "Location",
      value: jobCirculars.location || "Not specified",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      title: "Job Type",
      value: jobCirculars.job_type_label || "Not specified",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Deadline",
      value: jobCirculars.deadline || "Not specified",
      icon: <Headset className="w-8 h-8" />,
    },
  ];

  return (
    <section className="space-y-4">
      {/* Job Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="py-4 gap-3 px-3 border border-primary rounded-xl"
          >
            <div className="flex items-center text-center gap-4 ">
              <div className="backdrop-blur-sm bg-primary/20 text-primary p-2 rounded-xl">
                {category.icon}
              </div>
              <div className="text-left">
                <h4 className="text-base font-semibold mb-1">
                  {category.title}
                </h4>
                <p className="text-sm text-black">{category.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tools Section */}
      {jobCirculars.tools && jobCirculars.tools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tools Required:</h3>
          <div className="flex flex-wrap gap-2">
            {jobCirculars.tools.map((tool) => (
              <span
                key={tool.id}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                {tool.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default JobInfoCardBySlug;
