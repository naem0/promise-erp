import { Users, Briefcase, BookOpen, Headset, User2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmployeeCategory {
  count: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const totalEmployees = 1285;

const categories: EmployeeCategory[] = [
  {
    count: 170,
    title: "Executive Management",
    description: "Plan, organize & allocate resources",
    icon: <Briefcase className="w-8 h-8" />,
  },
  {
    count: 405,
    title: "Operations Officer",
    description: "Execute business & oversee job",
    icon: <Users className="w-8 h-8" />,
  },
  {
    count: 384,
    title: "Expert Trainers",
    description: "Teach & lead by example",
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    count: 326,
    title: "Support Staff",
    description: "Meet, assist, support & follow",
    icon: <Headset className="w-8 h-8" />,
  },
];

const EmployeeCategory = () => {
  return (
    <section className="py-8 md:py-12">
      {/* Total Employees Header */}
      <div className="flex justify-center mb-12">
        <div className="bg-linear-to-r from-secondary to-secondary/80 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold"><User2 /></span>
          </div>
          <span className="text-sm font-semibold">
            Total Employees: {totalEmployees}
          </span>
        </div>
      </div>

      {/* Employee Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-2 lg:gap-4">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg text-white"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="bg-white backdrop-blur-sm text-primary p-3 rounded-xl mb-4">
                {category.icon}
              </div>

              {/* Employee Count */}
              <h3 className=" text-xl lg:text-4xl font-bold mb-2">{category.count}</h3>

              {/* Title */}
              <h4 className="text-sm lg:text-lg font-semibold mb-2">{category.title}</h4>

              {/* Description */}
              <p className="text-sm text-emerald-100 leading-relaxed">
                {category.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default EmployeeCategory;
