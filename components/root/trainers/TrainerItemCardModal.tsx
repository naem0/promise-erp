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

  console.log("-------", member);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogClose className="absolute right-4 cursor-pointer top-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
          <X className="h-4 w-4 text-black" />
        </DialogClose>
        <div className="h-24 bg-[url('/images/empolyeemodalheader.png')] bg-no-repeat bg-cover"></div>

        <div className="-mt-16 px-6 pb-6 text-center">
          <DialogHeader className="">
            <DialogTitle className="text-white text-center text-base xl:text-2xl font-bold">
              {
                member?.name && member.name 
              }
            </DialogTitle>
            <div className="flex items-center justify-start gap-4">
              <div className="rounded-full bg-white relative w-[140px] h-[140px] overflow-hidden border-4 border-secondary shadow-lg">
                <Image
                  src={member.profile_image || "/images/placeholder_img.jpg"}
                  alt={member.name}
                  fill
                  className="object-scale-down "
                />
              </div>
              <div className="">
                {
                  member.designation && <p className="text-lg text-secondary font-medium">{member?.designation}</p>
                }
                {
                  member.experience && <p className="text-base text-black font-medium">{member?.experience} Years of Experience</p>
                }
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {
              member.note && <div className="bg-muted p-4 rounded-lg text-sm">{member?.note}</div>
            }
            {
              member.courses && <div className="bg-muted p-4 rounded-lg text-sm">{member?.courses}</div>
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerItemCardModal;
