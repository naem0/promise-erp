"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import Image from "next/image";
import { TeacherList } from "@/apiServices/webPageTrainerService";
import { useState } from "react";
import TrainerItemCardModal from "./TrainerItemCardModal";
interface TrainerProps {
  trainer: TeacherList;
}
const TrainerItemCard = ({ trainer }: TrainerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div onClick={() => setOpen(true)} className="flex flex-col items-center group cursor-pointer h-full">
        <div className="z-10 relative h-40 w-[65%] bg-white rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105">
          <Image
            src={trainer?.profile_image || "/images/placeholder_img.jpg"}
            alt={trainer?.name || "teacher image"}
            fill
            className="border border-primary/10 object-cover rounded-2xl transition-transform duration-700"
          />
        </div>

        {/* Card */}
        <Card className="text-center relative flex-1 pb-0 w-full rounded-2xl shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 -mt-20 pt-24 flex flex-col overflow-hidden">
          <CardContent className="relative flex-1 p-6">
            {trainer?.name && (
              <h3 className="text-lg md:text-xl capitalize font-bold text-secondary mb-1 line-clamp-1">
                {trainer?.name}
              </h3>
            )}
            {trainer?.designation && (
              <p className="text-primary text-sm font-semibold mb-3 line-clamp-1">
                {trainer?.designation}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-primary/80 mb-4 bg-primary/5 py-1.5 rounded-full">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">সার্টিফাইড ট্রেইনার</span>
            </div>
            
            {trainer?.experience && (
              <p className="text-muted-foreground text-sm font-medium">
                <span className="text-secondary font-bold">{trainer?.experience}</span> Years of Experience
              </p>
            )}
          </CardContent>
          <div className="h-1.5 bg-linear-to-r from-secondary via-primary to-secondary w-full"></div>
        </Card>
      </div>
      <TrainerItemCardModal member={trainer} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default TrainerItemCard;
