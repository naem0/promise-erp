import { ChairmanMessage } from "@/apiServices/employeeService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface TeamMember {
  member: ChairmanMessage;
}

const TeamMemberCard = ({ member }: TeamMember) => {
  const isTypeTwo = member.type === 2;

  return (
    <div
      className={`grid ${
        isTypeTwo ? "md:grid-cols-[220px_1fr]" : "md:grid-cols-[1fr_220px]"
      } border rounded-xl shadow-md hover:shadow-lg transition bg-white`}
    >
      {/* Avatar */}
      <div
        className={`hidden md:flex items-center p-4 ${
          isTypeTwo ? "justify-start order-1" : "justify-end order-2"
        }`}
      >
        <div className="p-3 relative rounded-lg bg-[url(/images/Executive-Management-bg.png)] h-full md:w-[75%] flex items-center justify-center">
          <div
            className={`absolute bg-white rounded-full p-1 h-36 w-36 shadow-md flex justify-center items-center ${
              isTypeTwo ? "-right-10" : "-left-10"
            }`}
          >
            <Avatar className="h-32 w-32 border-4 border-primary rounded-full">
              <AvatarImage
                src={member.chairman_image}
                alt={member.name}
                className=" object-scale-down"
              />
            </Avatar>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden flex items-center p-4 ${
          isTypeTwo ? "justify-start order-1" : "justify-end order-2"
        }`}
      >
        <div className="p-3 rounded-lg bg-[url(/images/Executive-Management-bg22.png)] bg-size-[100%] bg-no-repeat h-full w-full flex items-center justify-center">
          <div
            className={` bg-white rounded-full p-1 h-36 w-36 shadow-md flex justify-center items-center  `}
          >
            <Avatar className="h-32 w-32 border-4 border-primary rounded-full">
              <AvatarImage
                src={member.chairman_image}
                alt={member.name}
                className=" object-scale-down"
              />
            </Avatar>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 py-6 ${isTypeTwo ? "order-2" : "order-1"}`}>
        {/* Name + Designation */}
        <div className={isTypeTwo ? "text-right" : "text-left"}>
          <h3 className="text-2xl md:text-4xl font-bold text-secondary">
            {member.name}
          </h3>

          <p className="text-base font-extrabold text-secondary/80 mt-1">
            {member.designation}
          </p>
        </div>

        {/* Message Content (Always Left) */}
        <div className="mt-6 relative text-left">
          <Quote className="text-primary w-10 h-10 mb-2 rotate-180" />

          <p className="text-gray-700 leading-relaxed max-w-md">
            {member.message_content}
          </p>

          <div className="flex justify-end mt-4">
            <Quote className="text-primary w-8 h-8 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
