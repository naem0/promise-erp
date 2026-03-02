"use client";
import { useState } from "react";
import TrainerItemCard from "./TrainerItemCard";
import TrainerItemCardModal from "./TrainerItemCardModal";
import { TeacherList } from "@/apiServices/webPageTrainerService";
interface TrainerProps {
  trainer: TeacherList;
}
const TrainerItemInfos = ({ trainer }: TrainerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>
        <TrainerItemCard trainer={trainer} />
      </div>
      <TrainerItemCardModal member={trainer} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default TrainerItemInfos;
