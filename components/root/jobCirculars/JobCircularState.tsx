import { Card } from "@/components/ui/card";
import { JobCircularsState } from "./JobCircularJoinUs";
interface EmployeeStateProps {
  category: JobCircularsState;
}
const JobCircularState = ({ category }: EmployeeStateProps) => {
  return (
    <Card className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg text-white">
      <div className="flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="bg-white backdrop-blur-sm text-primary p-3 rounded-xl mb-4">
          {category.icon}
        </div>

        {/* Employee Count */}
        {/* <h3 className="text-4xl font-bold mb-2">{category.id}</h3> */}

        {/* Title */}
        <h4 className="text-lg font-semibold mb-2">{category.title}</h4>

        {/* Description */}
        <p className="text-sm text-emerald-100 leading-relaxed">
          {category.description}
        </p>
      </div>
    </Card>
  );
};

export default JobCircularState;
