import { AllOfficeEmployee } from "@/apiServices/employeeService";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

interface Props {
  employee: AllOfficeEmployee;
}

const GeneralTeamMemberCardItem = ({ employee }: Props) => {
  const imageUrl = employee.profile_image || "/images/placeholder_img.jpg";
  return (
    <div className="grid md:grid-cols-2 border border-primary rounded-xl shadow-md hover:shadow-lg transition bg-white h-full">
      {/* Avatar */}
      <div className="hidden md:flex items-center justify-end px-2 py-4">
        <div className="p-3 relative rounded-lg bg-[url(/images/Executive-Management-bg2.png)] bg-no-repeat h-full w-full flex items-center justify-center">
          <div className="absolute right-10 bg-white rounded-full p-1 h-28 w-28 shadow-md flex justify-center items-center">
            <div className="h-24 w-24 border-4 border-primary relative rounded-full">
              <Image
                src={imageUrl}
                alt={employee.name || "officer image"}
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex items-center px-3 pt-3">
        <div className="p-3 rounded-lg bg-[url(/images/Executive-Management-bg10.png)] bg-size-[100%] bg-no-repeat h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-full p-1 h-28 w-28 shadow-md flex justify-center items-center">
            <div className="h-24 w-24 border-4 border-primary relative rounded-full">
              <Image
                src={imageUrl}
                alt={employee.name || "officer image"}
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 md:pr-4 py-4 md:py-6 min-h-40 md:min-h-54">
        <h3 className="text-xl font-bold text-secondary mb-2">
          {employee.name || "Officer Name"}
        </h3>

        <p className="text-sm text-secondary/80">
          {employee.designation || "No Designation"}
        </p>

        <div className="mt-2 space-y-2">
          {employee.email && (
            <p className="text-black text-sm wrap-anywhere">
              <span> {employee.email}</span>
            </p>
          )}

          {employee.phone && (
            <p className="text-black text-sm">{employee.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralTeamMemberCardItem;
