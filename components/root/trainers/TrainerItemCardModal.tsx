"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TeacherList } from "@/apiServices/webPageTrainerService";
import { X } from "lucide-react";

interface Props {
  member: TeacherList;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TrainerItemCardModal = ({ member, open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 overflow-hidden max-h-[95vh] overflow-y-auto">
        <DialogClose className="absolute right-4 cursor-pointer top-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
          <X className="h-4 w-4 text-black" />
        </DialogClose>
        <div className="h-32 bg-[url('/images/empolyeemodalheader.png')] bg-no-repeat bg-cover bg-center"></div>

        <div className="-mt-12 px-6 pb-8">
          <DialogHeader className="text-left">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="shrink-0 rounded-full bg-white relative w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-secondary shadow-xl">
                <Image
                  src={(member.profile_image && typeof member.profile_image === "string" && member.profile_image.trim() !== "") ? member.profile_image : "/images/placeholder_img.jpg"}
                  alt={member.name || "Trainer"}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 text-center md:text-left pb-2">
                <DialogTitle className="text-xl md:text-2xl font-bold text-secondary mb-1">
                  {member?.name}
                </DialogTitle>
                {member.designation && (
                  <p className="text-lg text-primary font-semibold">
                    {member.designation}
                  </p>
                )}
                {member.experience && (
                  <p className="text-base text-muted-foreground font-medium">
                    {member.experience} Years of Experience
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            {member.note && (
              <div className="bg-muted/50 p-6 rounded-xl border border-border">
                <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  About Trainer
                </h4>
                <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {member.note}
                </div>
              </div>
            )}
            {member.courses && (
              <div className="bg-muted/50 p-6 rounded-xl border border-border">
                <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Courses Conducted
                </h4>
                <div className="text-sm leading-relaxed text-foreground/80">
                  {member.courses}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerItemCardModal;
