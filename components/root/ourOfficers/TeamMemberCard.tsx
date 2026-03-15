// import { ChairmanMessage } from "@/apiServices/employeeService";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Quote } from "lucide-react";

// interface TeamMember {
//   member: ChairmanMessage;
// }

// const TeamMemberCard = ({ member }: TeamMember) => {
//   const isTypeTwo = member.type === 2;

//   return (
//     <div
//       className={`grid px-4 ${
//         isTypeTwo ? "md:grid-cols-[220px_1fr]" : "md:grid-cols-[1fr_220px]"
//       } border rounded-xl shadow-md hover:shadow-lg transition bg-white`}
//     >
//       <div
//         className={`flex items-center p-4 ${
//           isTypeTwo ? "justify-start order-1" : "justify-end order-2"
//         }`}
//       >
//         <div className="p-3 relative rounded-lg bg-[url(/images/message-for-md.png)] bg-size-[100%] bg-no-repeat min-h-full md:min-h-70 w-full flex items-center justify-center">
//           <div
//             className={`bg-white rounded-full p-1 h-36 w-36 shadow-md flex justify-center items-center ${
//               isTypeTwo ? "-right-10" : "-left-10"
//             }`}
//           >
//             <Avatar className="h-32 w-32 border-4 border-primary rounded-full bg-white">
//               <AvatarImage
//                 src={member.chairman_image}
//                 alt={member.name}
//                 className="object-scale-down rounded-full"
//               />
//             </Avatar>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className={`px-4 py-6 ${isTypeTwo ? "order-2" : "order-1"}`}>
//         {/* Name + Designation */}
//         <div className={isTypeTwo ? "text-right" : "text-left"}>
//           <h3 className="text-2xl md:text-4xl font-bold text-secondary">
//             {member.name}
//           </h3>
//           <p className="text-base font-extrabold text-secondary/80 mt-1">
//             {member.designation}
//           </p>
//         </div>

//         {/* Message Content (Always Left) */}
//         <div className="mt-6 relative text-left">
//           <p className="text-black/60 leading-relaxed relative gap-2 ps-8 pe-7">
//             <Quote className="text-primary w-6 h-6 mb-2 rotate-180 absolute left-0 top-0" />
//             {member.message_content}
//             <Quote className="text-primary w-6 h-6 absolute right-0 bottom-0" />
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamMemberCard;

import { ChairmanMessage } from "@/apiServices/employeeService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface Props {
  member: ChairmanMessage;
}

const TeamMemberCard = ({ member }: Props) => {
  const isTypeTwo = member.type === 2;

  return (
    <div
      className={`grid px-4 border border-primary ${
        isTypeTwo ? "md:grid-cols-[220px_1fr]" : "md:grid-cols-[1fr_220px]"
      } border rounded-xl shadow-md hover:shadow-lg transition bg-white`}
    >
      {/* Image */}
      <div
        className={`flex items-center py-4 ${
          isTypeTwo ? "justify-start order-1" : "justify-end order-2"
        }`}
      >
        <div className="relative p-3 rounded-lg bg-[url(/images/message-for-md.png)] bg-no-repeat bg-size-[100%] min-h-full md:min-h-70 w-full flex justify-center items-center">
          <div
            className={`bg-white rounded-full p-1 h-36 w-36 shadow-md flex items-center justify-center ${
              isTypeTwo ? "-right-10" : "-left-10"
            }`}
          >
            <Avatar className="h-32 w-32 border-4 border-primary rounded-full">
              <AvatarImage
                src={member.chairman_image}
                alt={member.name}
                className="object-scale-down rounded-full"
              />
            </Avatar>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 py-6 ${isTypeTwo ? "order-2" : "order-1"}`}>
        <div className={isTypeTwo ? "text-right" : "text-left"}>
          <h3 className="text-2xl md:text-4xl font-bold text-secondary mb-3">
            {member.name}
          </h3>
          <p className="text-base font-extrabold text-secondary/80 mt-1">
            {member.designation}
          </p>
        </div>

        {/* Message */}
        <div className="mt-6 relative">
          <p className="text-black/60 text-lg md:text-xl leading-relaxed ps-8 pe-7 max-w-fit">
            {member.message_content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
