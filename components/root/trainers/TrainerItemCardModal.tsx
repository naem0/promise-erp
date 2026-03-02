"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, PhoneCall } from "lucide-react";
import { TeacherList } from "@/apiServices/webPageTrainerService";

interface Props {
  member: TeacherList;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TrainerItemCardModal = ({ member, open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="h-24 bg-linear-to-r from-secondary via-primary to-secondary" />

        <div className="-mt-16 px-6 pb-6 text-center">
          <DialogHeader className="">
            <DialogTitle className="text-white text-center text-base xl:text-2xl font-bold">
              {member.name || "Trainer Name ---"}
            </DialogTitle>
            <div className="flex items-center justify-start gap-4">
              <div className="rounded-full relative w-[140px] h-[140px] overflow-hidden border-4 border-secondary shadow-lg">
                <Image
                  src={member.profile_image || "/images/placeholder_img.jpg"}
                  alt={member.name}
                  fill
                  className="object-scale-down "
                />
              </div>
              <div className="">
                <h2 className="text-xl font-semibold">
                  {member.designation || "Designation ---"}
                </h2>
                <p className="text-primary">
                  {member.experience || "Experience ---"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg flex justify-center gap-2">
              <Mail /> {member.email || "Email Address ---"}
            </div>
            <div className="bg-muted p-4 rounded-lg flex justify-center gap-2">
              <PhoneCall /> {member.phone || "Phone Number ---"}
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm">
              {member.note || "Note ---"}
            </div>
            <div className="bg-muted p-4 rounded-lg text-sm">
              {member.courses || "Courses ---"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerItemCardModal;
