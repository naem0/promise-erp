// "use client";

// import Image from "next/image";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { AllOfficeEmployee } from "@/apiServices/employeeService";
// import { X } from "lucide-react";

// interface Props {
//   employee: AllOfficeEmployee;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const EmployeeItemModal = ({ employee, open, onOpenChange }: Props) => {
//   const imageUrl = employee.profile_image || "/images/placeholder_img.jpg";

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="relative max-w-2xl p-0 overflow-hidden">
//         {/* close button */}
//         <DialogClose className="absolute right-4 top-4 z-50 bg-white rounded-full p-2 shadow-md">
//           <X className="h-4 w-4 text-black" />
//         </DialogClose>

//         {/* header */}
//         <div className="h-24 bg-gradient-to-r from-secondary via-primary to-secondary flex items-center justify-center">
//           <DialogTitle className="text-white text-xl font-bold">
//             {employee.name}
//           </DialogTitle>
//         </div>

//         {/* body */}
//         <div className="-mt-16 px-6 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-secondary shadow-lg">
//               <Image
//                 src={imageUrl}
//                 alt={employee.name || "employee"}
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold">
//                 {employee.designation || "No Designation"}
//               </h2>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EmployeeItemModal;

"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { AllOfficeEmployee } from "@/apiServices/employeeService";
import { X } from "lucide-react";

interface Props {
  employee: AllOfficeEmployee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeItemModal = ({ employee, open, onOpenChange }: Props) => {
  const imageUrl = employee.profile_image || "/images/placeholder_img.jpg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogClose className="absolute right-4 cursor-pointer top-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
          <X className="h-4 w-4 text-black" />
        </DialogClose>

        <DialogHeader className="p-0">
          <div className="h-24 bg-[url('/images/empolyeemodalheader.png')] bg-no-repeat bg-cover"></div>
        </DialogHeader>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between gap-4 ">
            <div className="rounded-full relative w-[140px] h-[140px] overflow-hidden border-4 border-secondary shadow-lg">
              <Image
                src={imageUrl}
                alt={employee.name || "employee"}
                fill
                className="object-scale-down "
              />
            </div>
            <div className=" flex-1">
              {employee?.name || "Employee Name ---"}
              <h2 className="text-xl font-semibold">
                {employee.designation || "Designation ---"}
              </h2>
              <p className="text-primary">
                {employee?.experience || "experience ---"} Experience
              </p>
            </div>
          </div>
          {employee?.phone && (
            <div className="px-4 bg-secondary/5 py-4 text-center rounded-xl text-base my-4">
              <p className="">{employee.phone || "No Phone Number"}</p>
            </div>
          )}
          {employee?.email && (
            <div className="px-4 bg-secondary/5 py-4 text-center rounded-xl text-base">
              <p className=" ">{employee.email || "No Email"}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeItemModal;
