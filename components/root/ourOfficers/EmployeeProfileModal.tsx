"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { AllOfficeEmployee } from "@/apiServices/employeeService";


interface Props {
  member: AllOfficeEmployee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeProfileModal = ({ member, open, onOpenChange }: Props) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_260px]">
          {/* Content Section */}
          <div className="px-6 py-8">
            <h3 className="text-3xl font-bold text-gray-900">{member.name}</h3>

            <p className="text-md text-gray-600 mt-2">{member.designation}</p>

            <p className="text-sm text-gray-500 mt-1">{member.email}</p>

            {/* Quote Section */}
            <div className="mt-8 relative">
              <Quote className="text-primary w-10 h-10 mb-2" />

              <p className="text-gray-700 leading-relaxed max-w-xl">
                We are not just building a platform; we are building a bridge
                between curiosity and a paycheck.
              </p>

              <div className="flex justify-end mt-4">
                <Quote className="text-primary w-8 h-8 rotate-180" />
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-[url(/images/Executive-Management-bg.png)] bg-cover bg-center relative p-6">
            <div className="bg-white rounded-full p-2 h-40 w-40 shadow-lg flex items-center justify-center">
              <Avatar className="h-36 w-36 border-4 border-primary rounded-full">
                <AvatarImage src={member.profile_image} alt={member.name} />
              </Avatar>
            </div>
          </div>

          {/* Mobile Image Section */}
          <div className="md:hidden flex items-center justify-center p-6 bg-[url(/images/Executive-Management-bg22.png)] bg-cover bg-no-repeat">
            <div className="bg-white rounded-full p-2 h-40 w-40 shadow-lg">
              <Avatar className="h-36 w-36 border-4 border-primary rounded-full">
                <AvatarImage src={member.profile_image} alt={member.name} />
              </Avatar>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfileModal;
