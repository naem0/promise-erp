import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";
import { TeacherList } from "@/apiServices/webPageTrainerService";
interface TrainerProps {
  trainer: TeacherList;
}
const TrainerItemCard = ({ trainer }: TrainerProps) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className=" z-20 relative h-44 w-[70%] bg-white rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-102">
        <Image
          src={trainer?.profile_image || "/images/placeholder_img.jpg"}
          alt={trainer?.name || "teacher image"}
          fill
          className="border border-primary/10 object-contain rounded-2xl transition-transform duration-700 group-hover:scale-102"
        />
      </div>

      {/* Card */}
      <Card className="text-center h-full pb-0 w-full rounded-2xl shadow-md transition-all duration-500 -mt-20 pt-28 group-hover:-translate-y-2 group-hover:shadow-xl">
        <CardContent>
          <h3 className="text-base md:text-xl capitalize font-bold text-secondary mb-1">
            {trainer?.name || "Teacher Name ---"}
          </h3>

          <p className="text-black/75 text-base font-medium mb-2">
            {trainer?.designation ?? "Designation ---"}
          </p>

          <div className="flex items-center justify-center gap-2 text-primary mb-2 animate-fade-in">
            <Award />
            <span className="text-base font-medium">সার্টিফাইড ট্রেইনার</span>
          </div>

          <p className="text-black/75 text-base">
            {trainer.experience || "Experience ---"}
          </p>
        </CardContent>
        <div className="h-2 bg-linear-to-r from-secondary w-full via-primary to-secondary rounded-b-lg"></div>
      </Card>
    </div>
  );
};

export default TrainerItemCard;
